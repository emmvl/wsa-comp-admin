import React from 'react';
import PropTypes from 'prop-types';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';
import { Input } from 'antd';

import './style.css';

const PlacesAutocomplete = ({
  onSetData,
}) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: ['au'] },
    },
    debounce: 300,
  });

  const ref = useOnclickOutside(() => {
    clearSuggestions();
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = ({ description }) => () => {
    setValue(description, false);
    clearSuggestions();
    const data = {
      address: description,
      lat: '',
      lng: '',
    };
    data.address = description;
    // Get latitude and longitude via utility functions
    getGeocode({ address: description })
        .then((results) => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          console.log({
            name: 'Current position',
            position: {
              lat,
              lng,
            },
          });
          data.lat = lat;
          data.lng = lng;
          onSetData({ [`field_dispatch-location`]: data });
        })
        .catch((error) => {
          console.log('Error: ', error);
        });
  };

  const renderSuggestions = () => data.map((suggestion) => {
    const {
      id,
      structured_formatting: { main_text: mainText, secondary_text: secondaryText },
    } = suggestion;

    return (
        <li key={id} onClick={handleSelect(suggestion)}>
          <strong>{mainText}</strong>
          {' '}
          <small>{secondaryText}</small>
        </li>
    );
  });

  return (
      <div className="place-auto-complete-container" ref={ref}>
        <Input
            value={value}
            onChange={handleInput}
            disabled={!ready}
            placeholder="Please input location"
        />
        {/* We can use the "status" to decide whether we should display the dropdown or not */}
        {status === 'OK' && (
            <ul className="place-location">
              {renderSuggestions()}
              <li className="logo">
                <img
                    src="https://developers.google.com/maps/documentation/images/powered_by_google_on_white.png"
                    alt="Powered by Google"
                />
              </li>
            </ul>
        )}
      </div>
  );
};

PlacesAutocomplete.propTypes = {
  onSetData: PropTypes.func,
};

PlacesAutocomplete.defaultProps = {
  onSetData: () => {},
};

export default PlacesAutocomplete;
