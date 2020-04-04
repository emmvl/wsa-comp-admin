import React, { Component } from "react";
import { Modal, Spin } from "antd";
import AppImages from "../themes/appImages";



class ImageLoader extends Component {
    /////// render function 
    render() {
        return (
            <div>
                {
                    this.props.timeout ?

                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100, width: 100 }}>
                            <Spin />
                        </label>
                        :
                        this.props.video ?
                            <label>
                                <video
                                    src={this.props.src}
                                    height='120'
                                    width='120'
                                    poster={this.props.poster} />
                            </label>
                            :
                            <label>
                                <img
                                    className={this.props.className}
                                    src={this.props.src}
                                    alt=""
                                    height={this.props.height ? null : '120'}
                                    width={this.props.width ? null : '120'}
                                    style={{ borderRadius: this.props.borderRadius ? null : 60, marginLeft: 0 }}
                                    name={'image'}
                                    onError={ev => {
                                        ev.target.src = AppImages.circleImage;
                                    }}
                                />
                            </label>
                }
            </div>
        );
    }
}

export default ImageLoader;