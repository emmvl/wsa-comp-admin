import React from 'react';
import "./legendComponent.css";
class LegendComponent extends React.Component {

    render() {
        const { legendArray } = this.props
        return (
            <div >
                {legendArray.length > 0 && legendArray.map((item, index) => {
                    return (
                        <div className="legend-main-div">
                            {item.map((subItem) => {
                                return (
                                    <div className="legend-color-text-div" >
                                        <div>
                                            <div className="legend-color-div" style={{ backgroundColor: subItem.colorCode }} >
                                            </div>
                                        </div>
                                        <div className="legend-text-div">
                                            <span className="legend-text">{subItem.divisionName}-{subItem.gradeName}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        )
    }
}


export default LegendComponent;