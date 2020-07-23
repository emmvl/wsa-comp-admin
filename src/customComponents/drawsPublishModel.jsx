import React from 'react';
import { Modal,  Select,Checkbox,Radio} from 'antd';
import AppConstants from "../themes/appConstants"
import CustumToolTip from 'react-png-tooltip'
const { Option } = Select;

class DrawsPublishModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    
      render() {
            //console.log("Porps"+JSON.stringify(this.props));
            const { modalPublish, modalDivisions, modalRounds, publishVisible,
              modelCheckDivision, modelCheckRound, modelCancel ,modelRadio ,
              modalRadioValue ,modalIsShowPart , modalIsShowDivision, 
              modalIsShowRound, divisionGradeNameList, getDrawsRoundsData } = this.props;
            let filteredDivisions = divisionGradeNameList.filter(x=>x.competitionDivisionGradeId != 0);
            let filteredRounds = getDrawsRoundsData.filter(x=>x.roundId!= 0)
            return (
              <Modal
              title={AppConstants.publish}
              visible={publishVisible}
              onOk={modalPublish}
              onCancel={modelCancel}
              okText={AppConstants.publish}
              cancelButtonProps={{ style: { position: "absolute", left: 15 } }}
            >
              <div className="modal-publish-popup">
                  <div style={{display:'flex'}}>
                      <div className="breadcrumb-add" style={{ fontSize: 15, fontWeight: 700, marginLeft:10}}>
                        {AppConstants.whatDoYouWantToPublish}
                      </div>
                  </div>
                  <div>
                  <Radio.Group onChange={modelRadio} value={modalRadioValue} className="radio-model-popup">
                    <Radio value={1}>
                      {AppConstants.all}
                    </Radio>
                    <Radio value={2} >
                      {AppConstants.part}
                    </Radio>
                    {modalIsShowPart ? 
                    <div style={{display: 'grid'}}>
                      <Checkbox className="checkbox-model-popup" onChange={modelCheckDivision}>Divisions</Checkbox>
                      {modalIsShowDivision ?
                      <div className="col-sm-3 division">
                          <Select
                              mode="multiple"
                              style={{ width: "100%", minWidth: 370,marginLeft: 25 }}
                              onChange={modalDivisions}
                              filterOption={false}
                          >
                              {(filteredDivisions || []).map((item) => {
                                return (
                                  <Option
                                    key={'divisionGradeNameList' + item.competitionDivisionGradeId}
                                    value={item.competitionDivisionGradeId}
                                  >
                                    {item.name}
                                  </Option>
                                );
                              })}
                          </Select>
                      </div>
                      :null}
                      <Checkbox className="checkbox-model-popup" onChange={modelCheckRound}>Rounds</Checkbox>
                      {modalIsShowRound ?
                      <div className="col-sm-3 division" >
                          <Select
                              mode="multiple"
                              style={{ width: "100%", minWidth: 370,marginLeft: 25 }}
                              onChange={modalRounds}
                              filterOption={false}
                              //onSearch={(value) => { this.handleSearch(value, appState.mainVenueList) }}
                          >
                              {(filteredRounds || []).map((item) => {
                                return (
                                  <Option key={item.roundId} value={item.roundId}>
                                    {item.name}
                                  </Option>
                                );
                              })}
                          </Select>
                      </div>
                      :null}
                    </div>
                    :null}
                  </Radio.Group>
                  </div>
              </div>
            </Modal>
            )
    
      };

}
export default DrawsPublishModel;