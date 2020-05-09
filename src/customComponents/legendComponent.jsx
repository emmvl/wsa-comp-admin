import React from 'react';
import "./legendComponent.css";
class LegendComponent extends React.Component {

    render() {
        const { legendArray } = this.props
        return (
            <div className="legend-main-div">
                {legendArray.length > 0 && legendArray.map((item, index) => {
                    return (
                        <div className="legend-color-text-div" >
                            <div>
                                <div className="legend-color-div" style={{ backgroundColor: item.colorCode }} >
                                </div>
                            </div>
                            <div className="legend-text-div">
                                <span className="legend-text">{item.gradeName}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}


export default LegendComponent;