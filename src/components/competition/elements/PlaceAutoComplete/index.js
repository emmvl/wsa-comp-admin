import React from 'react';
import PropTypes from 'prop-types';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';
import {Input} from 'antd';

import './style.css';
import AppConstants from '../../../../themes/appConstants';

const mapAddressInfo = (addressComponents) => {
  if (addressComponents.length > 4) {
    return {
      addressOne: addressComponents[0].short_name,
      suburb: addressComponents[1].short_name,
      state: addressComponents[addressComponents.length - 3].short_name,
      postcode: addressComponents[addressComponents.length - 1].short_name,
    }
  }

  return {
    addressOne: null,
    suburb: null,
    state: null,
    postcode: null,
  };
};

const PlacesAutocomplete = ({
  heading, error, required, onSetData, ...otherProps
}) => {
  const {
    ready,
    value,
    suggestions: {status, data},
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: {country: ['au']},
    },
    debounce: 300,
  });

  const ref = useOnclickOutside(() => {
    clearSuggestions();
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = ({description}) => () => {
    setValue(description, false);
    clearSuggestions();
    const data = {
      address: description,
      mapData: null,
      lat: '',
      lng: '',
    };
    data.address = description;
    // Get latitude and longitude via utility functions
    getGeocode({address: description})
      .then((results) => {
        data.mapData = mapAddressInfo(results[0].address_components);
        return getLatLng(results[0])
      })
      .then(({lat, lng}) => {
        data.lat = lat;
        data.lng = lng;
        onSetData(data);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  const renderSuggestions = () => data.map((suggestion) => {
    const {
      place_id,
      structured_formatting: {main_text: mainText, secondary_text: secondaryText},
    } = suggestion;

    return (
      <li key={place_id} onClick={handleSelect(suggestion)}>
        <strong>{mainText}</strong>
        {' '}
        <small>{secondaryText}</small>
      </li>
    );
  });

  return (
    <div className="place-auto-complete-container" ref={ref}>
      {heading && (
        <div style={{display: 'flex', alignItems: 'center'}}>
          <span className={`input-heading ${required ? 'required-field' : ''}`}>{heading}</span>
        </div>
      )}
      <Input
        className="input"
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder={AppConstants.pleaseInputAddress}
        {...otherProps}
      />
      {status !== 'OK' && error && (
        <div style={{display: 'flex', alignItems: 'center'}}>
          <span className="place-auto-complete-input-error">{error}</span>
        </div>
      )}
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === 'OK' && (
        <ul className="place-location">
          {renderSuggestions()}
          <li className="logo" key="google">
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
  heading: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  onSetData: PropTypes.func,
};

PlacesAutocomplete.defaultProps = {
  heading: () => {
  },
  required: false,
  error: '',
  onSetData: () => {
  },
};

export default PlacesAutocomplete;
