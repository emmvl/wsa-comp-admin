import React, { Component } from "react";
import { Layout, Button, Breadcrumb, Popover } from "antd";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import history from "../../util/history";
import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";
import { locationArr, timeSlots, drawsArray,lagendsArray } from '../../mocks/multiDraws'
import '../../../node_modules/react-grid-layout/css/styles.css'
import '../../../node_modules/react-resizable/css/styles.css'

const ReactGridLayout = WidthProvider(RGL);
const screenWidth = (window.innerWidth) * 0.5
let perColumn = screenWidth / 5
const { Footer } = Layout;
const content = (
    <div style={{ padding: 10 }}>
      <p>1-a Waverley V Cromer</p>
      <p>1-b Peninsula V Harbord</p>
      <p>1-c Newport V Manly</p>
      <p>1-d Allambie V Narrabeen</p>
    </div>
  );
class MultifieldDraws extends Component {
    constructor(props) {
        super(props);
        this.state = {
            multiDrawsArray: drawsArray
        };
    }
    static defaultProps = {
        isDraggable: true,
        autoSize: true,
        rowHeight: 30,
        onLayoutChange: () => function () { },
        cols: 50
    };

    componentDidMount() {
    }
    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="row ">
                    <div className="col-sm pt-1" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.draws}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="col-sm-8" style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
                        <div className="row">

                            <div className="col-sm pt-1">
                                <div
                                    className="comp-dashboard-botton-view-mobile"
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <Button className="primary-add-comp-form" type="primary">
                                        {AppConstants.edit}
                                    </Button>
                                </div>
                            </div>

                            <div className="col-sm pt-1">
                                <div
                                    className="comp-dashboard-botton-view-mobile"
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "flex-end"
                                    }}
                                >
                                    <Button className="primary-add-comp-form" type="primary">
                                        {AppConstants.exception}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <span className="inbox-name-text">Manly Warringah Winter 2020</span>
            </div>
        )
    }

    visibleTooltip(item, index, value) {

        let this_ = this
        let array = this_.state.multiDrawsArray
        array[index].visible = value

        this_.setState({ multiDrawsArray: array })
    }

    // slots
  generateDOM() {
    // Generate items with properties from the layout, rather than pass the layout directly
    const layout = this.generateLayout();
    let this_ = this;
    return _.map(layout, function (l) {
      return (
        <div
          style={{
            display: 'flex',
            backgroundColor: l.color,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className="div-styles"
          key={l.i}
          data-grid={l}
        >
          
            
          
          {l.whiteArea.map(() => {
            return (
              <Popover content={content} trigger={"click"}>
              <div
                key={1}
                style={{
                  height: 5,
                  width: 15,
                  backgroundColor: '#fff',
                  margin: 2.5,
                }}
              ></div>
              </Popover>
            );
          })}
          
        </div>
      );
    });
  }

    // drag layout view
    generateLayout() {
        const p = this.props;
        let this_ = this
        return _.map(this_.state.multiDrawsArray, function (item, i) {
            const minW = item.minW,
                minH = item.minH;
            const maxW = item.maxW,
                maxH = item.maxH;
            const w = item.normalW;
            const y = item.normalH;
            return {
                x: item.x,
                y: item.y,
                w,
                h: y,
                i: i.toString(),
                minW,
                maxW,
                minH,
                maxH,
                color: item.color,
                visible: item.visible,
                index: i,
                whiteArea: item.whiteArea
            };
        });
    }

    onLayoutChange(layout) {
        this.props.onLayoutChange(layout);
    }

    // contauner view
  containerView() {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: 70,
            alignItems: 'flex-end',
            paddingBottom: 10,
          }}
        >
          <div style={{ paddingLeft: 100 }}></div>
          <div
            style={{
              display: 'flex',
              width: screenWidth - perColumn,
              flexDirection: 'row',
            }}
          >
            {timeSlots.map((item, index) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    width: perColumn,
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      paddingLeft: 10,
                    }}
                  >
                    {index === 0 ? (
                      <span>{item.day}</span>
                    ) : (
                      <span style={{ paddingTop: 14 }} />
                    )}
                    <span>{item.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div
            style={{
              display: 'flex',
              paddingLeft: 50,
              paddingRight: 10,
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {locationArr.map((item, index) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 30,
                    marginTop: index == 0 ? 0 : 10,
                    backgroundColor: item.color,
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}
                >
                  <span>{item.name}</span>
                </div>
              );
            })}
          </div>

          <div style={{ width: screenWidth - perColumn }}>
            <ReactGridLayout
              containerPadding={[0, 0]}
              margin={[10, 10]}
              onLayoutChange={this.onLayoutChange}
              {...this.props}
              preventCollision={true}
              compactType={null}
              rowHeight={30}
            >
              {this.generateDOM()}
            </ReactGridLayout>
          </div>
        </div>
        <div className="mt-5" style={{ display: "flex", flexDirection: 'row', paddingLeft: 50 }}>
                    {lagendsArray.map((subItem) => {
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
      </div>
    );
  }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width mt-5">
                <div className="row">
                    <div className="col-sm">
                        <div className="reg-add-save-button">
                            <Button
                                type="cancel-button"
                                onClick={() => console.log("cancel")}>{AppConstants.cancel}</Button>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="comp-buttons-view">
                            <Button className="publish-button" type="primary"
                                htmlType="submit">
                                {AppConstants.save}
                            </Button>
                        </div>
                    </div>
                </div>
            </div >
        );
    };

    ////main render method
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.draws} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                <InnerHorizontalMenu menu={'competition'} compSelectedKey={'18'} />
                <Layout>
                    {this.headerView()}
                    {this.containerView()}
                    <Footer>{this.footerView()}</Footer>
                </Layout>
            </div>
        );
    }
}
export default MultifieldDraws;