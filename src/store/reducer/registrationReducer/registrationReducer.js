import ApiConstants from "../../../themes/apiConstants";
import history from "../../../util/history";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";

const newObjvalue = {
  orgRegistrationId: 0,
  yearRefId: 1,
  statusRefId: "",
  competitionUniqueKeyId: "",
  registrationOpenDate: "",
  registrationCloseDate: "",
  membershipProductTypes: [],
  specialNote: "",
  replyName: "",
  replyRole: "",
  replyEmail: "",
  replyPhone: "",
  trainingDaysAndTimes: "",
  trainingVenueId: null,
  registerMethods: [],
  registrationSettings: [],
  registrationDisclaimer: []
};
const regFormChecked = {
  replyName: false,
  replyRole: false,
  replyEmail: false,
  replyPhone: false,
  venueVisible: false,
  daysVisible: false,
  replyContactVisible: false,
  trainingVisible: false,
}
const initialState = {
  onLoad: false,
  error: null,
  result: null,
  status: 0,
  regMembershipFeeListData: [], ////////registration membership fees list
  regMembershipFeeListPage: 1,
  regMembershipFeeListTotalCount: 1,
  getMembershipProductDetails: null, ////get membership product details
  getDefaultMembershipProductTypes: [],
  getRegFormCompetition: [], /// get registration form
  registrationFormData: JSON.parse(JSON.stringify([newObjvalue])),
  sendRegistrationFormData: JSON.parse(JSON.stringify([newObjvalue])),
  membershipProductFeesTableData: null,
  membershipProductDiscountType: [],
  membershipDiscountObject: {
    "membershipProductTypeMappingId": "Select",
    "membershipProductTypeDiscountId": 0,
    "membershipPrdTypeDiscountTypeRefId": 1,
    "amount": "",
    "description": "",
    "availableFrom": null,
    "availableTo": null,
    "discountTypeRefId": 1,
    "discountCode": "",
    "applyDiscount": 0,
    "question": "",
    "childDiscounts": []
  },
  membershipProductDiscountData:
  {
    "membershipProductId": "c282f3c0-6a98-457f-8feb-0eb33e5cd364",
    "statusRefId": 1,
    "membershipProductDiscounts": [
      {
        "discounts": []
      }
    ]
  },
  membershipProductId: "",
  selectedMemberShipType: [],
  membershipProductTypes: [],
  selectedProductName: [],
  defaultChecked: regFormChecked,
  defaultCompetitionID: "",
  allDivisionsData: [],
  selectedInvitees: [],
};




//get selected invitees 
function checkSlectedInvitees(array) {
  console.log(array)
  let selected = []
  if (array) {
    for (let i in array) {
      selected.push(array[i].registrationSettingsRefId)
    }
  }
  return selected

}


// get selection of cheked in reg form
function getSelectedCheck(obj, regFormData) {
  if (regFormData[0].trainingDaysAndTimes.length > 0) {
    obj.trainingVisible = true
    obj.daysVisible = true
  }
  if (regFormData[0].trainingVenueId !== null) {
    obj.trainingVisible = true
    obj.venueVisible = true
  }
  if (regFormData[0].replyName.length > 0) {
    obj.replyContactVisible = true
    obj.replyName = true
  }
  if (regFormData[0].replyEmail.length > 0) {
    obj.replyContactVisible = true
    obj.replyEmail = true
  }
  if (regFormData[0].replyPhone.length > 0) {
    obj.replyContactVisible = true
    obj.replyPhone = true
  }
  if (regFormData[0].replyRole.length > 0) {
    obj.replyContactVisible = true
    obj.replyRole = true
  }
  return obj
}
//\make  product array
function makeProducrTypeArr(data, selected) {
  for (let i in data) {
    if (selected.length > 0) {
      for (let j in selected) {
        if (data[i].id == selected[j].id) {
          data[i]["isSelected"] = true;
          data[i].registrationLock = selected[j].registrationLock;
          break;
        } else {
          data[i]["isSelected"] = false;
        }
      }
    } else {
      data[i]["isSelected"] = false;
    }
  }

  return data;
}

// for check is selected in table of form or not
function getProductArr(value, selected) {
  let newArr = [];
  for (let i in value) {
    let object = {
      membershipProductName: value[i].membershipProductName,
      membershipProductId: value[i].membershipProductId,
      membershipProductTypes: makeProducrTypeArr(
        value[i].membershipProductTypes,
        selected
      )
    };
    newArr.push(object);
  }
  return newArr;
}
// for updated and fillter Data of membership product
function getNewProdcutData(productArr, valueData) {
  let filterObject = productArr.filter(function (o1) {
    return valueData.some(function (o2) {
      return o1.membershipProductId === o2;
    });
  });
  return filterObject;
}

/// for check product exist in Array or not
function checkExistngProductId(productArr, id) {
  let status = false;
  for (let i in productArr) {
    if (productArr[i] === id) {
      return true;
    }
  }
  return false;
}

/////fillter Data of membership Product
function getFillteredData(
  getFormData,
  productListArray,
  selectedMemberShipType
) {
  let memberShipSelectedArr = getFormData
    ? getFormData[0].membershipProductTypes
    : [];

  let productArr = [];

  if (memberShipSelectedArr.length > 0) {
    for (let i in memberShipSelectedArr) {
      if (productArr.length == 0) {
        productArr.push(memberShipSelectedArr[i].membershipProductId);
        let matchIndex = productListArray.findIndex(
          x =>
            x.membershipProductId ==
            memberShipSelectedArr[i].membershipProductId
        );
        selectedMemberShipType.push(productListArray[matchIndex]);
      } else {
        if (
          !checkExistngProductId(
            productArr,
            memberShipSelectedArr[i].membershipProductId
          )
        ) {
          productArr.push(memberShipSelectedArr[i].membershipProductId);
          let matchIndex = productListArray.findIndex(
            x =>
              x.membershipProductId ==
              memberShipSelectedArr[i].membershipProductId
          );
          selectedMemberShipType.push(productListArray[matchIndex]);
        }
      }
    }
  } else {
  }
  return productArr;
}

//// Final selected product arr

function makeFinalProductArr(arr) {
  let array = [];
  for (let i in arr) {
    let typesArray = arr[i].membershipProductTypes;
    for (let j in typesArray) {
      if (typesArray[j].isSelected == true) {
        let selectedObj = {
          divisionId: typesArray[j].divisionId,
          divisionName: typesArray[j].divisionName,
          registrationLock: typesArray[j].registrationLock,
          membershipProductId: typesArray[j].membershipProductId,
          membershipProductTypeId: typesArray[j].membershipProductTypeId,
          membershipProductTypeMappingId:
            typesArray[j].membershipProductTypeMappingId,
          id: typesArray[j].id
        };
        array.push(selectedObj);
      }
    }
  }
  return array;
}



//////function for adding default fees object in the fees table array
function feesDataObject(allMembershipData, membershipProductName) {
  let feesTableData = [];
  let membershipTypesSelected =
    allMembershipData.membershipproduct.membershipProductTypes;
  let feesApiData = allMembershipData.membershipproductfee.membershipFees;
  let data = membershipTypesSelected;
  for (let i in data) {
    if (feesApiData == null) {
      var feesTableObject = {
        casualFee: 0,
        casualGst: 0,
        seasonalFee: 0,
        seasonalGst: 0,
        organisationId: 1,
        membershipProductName: membershipProductName,
        membershipProductFeesId: 0,
        membershipProductTypeRefName: data[i].membershipProductTypeRefName,
        membershipProductFeesTypeRefId: 1,
        membershipProductTypeMappingId: data[i].membershipProductTypeMappingId,
        editableIndex: parseInt(i)
      };
      feesTableData.push(feesTableObject);
    } else {
      let item = data[i];
      let mappedMembershipTypeIndex = feesApiData.findIndex(
        x =>
          x.membershipProductTypeMappingId ==
          item.membershipProductTypeMappingId
      );
      if (mappedMembershipTypeIndex > -1) {
        feesApiData[mappedMembershipTypeIndex]["editableIndex"] = parseInt(i);
        feesTableData.push(feesApiData[mappedMembershipTypeIndex]);
      } else {
        var feesTableObject = {
          casualFee: 0,
          casualGst: 0,
          seasonalFee: 0,
          seasonalGst: 0,
          organisationId: 1,
          membershipProductName: membershipProductName,
          membershipProductFeesId: 0,
          membershipProductTypeRefName: data[i].membershipProductTypeRefName,
          membershipProductFeesTypeRefId: 1,
          membershipProductTypeMappingId:
            data[i].membershipProductTypeMappingId,
          editableIndex: parseInt(i)
        };
        feesTableData.push(feesTableObject);
      }
    }
  }
  return feesTableData;
}
//////function for adding default discount object in the discount table array
function discountDataObject(data) {
  let discountArray = []
  let membershipProductDiscountsArr = data.membershipproductdiscount.membershipProductDiscounts
  if (membershipProductDiscountsArr) {
    if (membershipProductDiscountsArr[0].discounts) {
      discountArray = membershipProductDiscountsArr[0].discounts
    } else {
      discountArray = []
    }
  } else {
    discountArray = []
  }
  return discountArray

}

/////function to check membership types in the membership product section tab in membership fees
function getDefaultMembershipType(data) {
  let membershipProductTypesTempArray = []
  if (data) {
    if (data.membershipproducttypes) {
      let getMembershipType = data.membershipproducttypes.MembershipProductTypes
      for (let i in getMembershipType) {
        if (isNullOrEmptyString(getMembershipType[i].dobFrom) && isNullOrEmptyString(getMembershipType[i].dobTo)) {
          getMembershipType[i]["isMandate"] = true;
        }
        else {
          getMembershipType[i]["isMandate"] = false;
        }
        if (getMembershipType[i].membershipProductTypeMappingId > 0) {
          getMembershipType[i]["isMemebershipType"] = true;
        }
        else {
          getMembershipType[i]["isMemebershipType"] = false;
        }
      }
      membershipProductTypesTempArray = getMembershipType
    }

  }
  return membershipProductTypesTempArray
}


function registration(state = initialState, action) {
  switch (action.type) {


    //////get the membership fee list in registration
    case ApiConstants.API_REG_MEMBERSHIP_LIST_LOAD:
      return { ...state, onLoad: true, error: null };

    case ApiConstants.API_REG_MEMBERSHIP_LIST_SUCCESS:
      let membershipListData = action.result;
      return {
        ...state,
        onLoad: false,
        regMembershipFeeListData: membershipListData.membershipFees,
        regMembershipFeeListTotalCount: membershipListData.page.totalCount,
        regMembershipFeeListPage: membershipListData.page
          ? membershipListData.page.currentPage
          : 1,
        status: action.status,
        error: null
      };



    //////save the Registration Form
    case ApiConstants.API_REG_FORM_LOAD:
      return { ...state, onLoad: true, error: null };

    case ApiConstants.API_REG_FORM_SUCCESS:
      return {
        ...state,
        onLoad: false,
        status: action.status,
        error: null
      };

    ///////////get the default membership  product types in registartion membership fees
    case ApiConstants.API_REG_GET_DEFAULT_MEMBERSHIP_PRODUCT_TYPES__LOAD:
      return { ...state, onLoad: true, error: null };

    case ApiConstants.API_REG_GET_DEFAULT_MEMBERSHIP_PRODUCT_TYPES_SUCCESS:
      let membershipProductDefaultTypesTempArray = []
      if (action.result) {
        if (action.result.membershipproducttypes) {
          if (action.result.membershipproducttypes.MembershipProductTypes) {
            let defaultMembershipType = action.result.membershipproducttypes.MembershipProductTypes
            for (let i in defaultMembershipType) {
              defaultMembershipType[i]["isMandate"] = false;
              defaultMembershipType[i]["isMemebershipType"] = false;
            }
            membershipProductDefaultTypesTempArray = defaultMembershipType
          }
        }
      }
      return {
        ...state,
        onLoad: false,
        status: action.status,
        getDefaultMembershipProductTypes: membershipProductDefaultTypesTempArray,
        error: null
      };

    //////delete the membership list product
    case ApiConstants.API_REG_MEMBERSHIP_LIST_DELETE_LOAD:
      return { ...state, onLoad: true, error: null };

    case ApiConstants.API_REG_MEMBERSHIP_LIST_DELETE_SUCCESS:
      return {
        ...state,
        onLoad: false,
        status: action.status,
        error: null
      };

    //////get the membership  product details
    case ApiConstants.API_REG_GET_MEMBERSHIP_PRODUCT__LOAD:
      return { ...state, onLoad: true, error: null };

    case ApiConstants.API_REG_GET_MEMBERSHIP_PRODUCT_SUCCESS:
      let finalDiscountData = discountDataObject(action.result)
      state.membershipProductDiscountData.membershipProductDiscounts[0].discounts = finalDiscountData
      state.membershipProductId = action.result.membershipproduct.membershipProductId;
      let feesDeafultobj1 = {
        membershipProductId: state.membershipProductId,
        membershipFees: feesDataObject(action.result, action.result.membershipproduct.membershipProductName)
      };
      state.membershipProductFeesTableData = feesDeafultobj1;
      return {
        ...state,
        onLoad: false,
        status: action.status,
        getMembershipProductDetails: action.result,
        getDefaultMembershipProductTypes: getDefaultMembershipType(action.result),
        error: null
      };

    //////save the membership  product details
    case ApiConstants.API_REG_SAVE_MEMBERSHIP_PRODUCT__LOAD:
      state.membershipProductFeesTableData = null;
      return { ...state, onLoad: true, error: null };

    case ApiConstants.API_REG_SAVE_MEMBERSHIP_PRODUCT_SUCCESS:
      let allMembershipData = action.result.data;
      let membershipProductName =
        allMembershipData.membershipproduct.membershipProductName;
      state.membershipProductId =
        allMembershipData.membershipproduct.membershipProductId;
      let feesDeafultobj = {
        membershipProductId: state.membershipProductId,
        membershipFees: feesDataObject(allMembershipData, membershipProductName)
      };
      state.membershipProductFeesTableData = feesDeafultobj;
      // history.push('/registrationMembershipList');

      return {
        ...state,
        onLoad: false,
        status: action.status,
        getMembershipProductDetails: action.result.data,
        getDefaultMembershipProductTypes: getDefaultMembershipType(action.result.data),
        error: null
        // membershipProductDiscountData: finalDiscountData1,


      };

    //////save the membership  product Fees
    case ApiConstants.API_REG_SAVE_MEMBERSHIP_PRODUCT_FEES__LOAD:
      return { ...state, onLoad: true, error: null };

    case ApiConstants.API_REG_SAVE_MEMBERSHIP_PRODUCT_FEES_SUCCESS:
      return {
        ...state,
        onLoad: false,
        status: action.status,
        getMembershipProductDetails: action.result.data,
        membershipProductFeesTableData: action.result.data.membershipproductfee,
        getDefaultMembershipProductTypes: getDefaultMembershipType(action.result.data),
        error: null
      };

    //////save the membership  product discount
    case ApiConstants.API_REG_SAVE_MEMBERSHIP_PRODUCT_DISCOUNT__LOAD:
      return { ...state, onLoad: true, error: null };

    case ApiConstants.API_REG_SAVE_MEMBERSHIP_PRODUCT_DISCOUNT_SUCCESS:
      return {
        ...state,
        onLoad: false,
        status: action.status,
        error: null
      };

    ///////////chnage the membership fees table data
    case ApiConstants.CHANGE_MEMBERSHIP_FEES_TABLE_INPUT:
      let data = state.membershipProductFeesTableData.membershipFees;
      let recordId = action.record.editableIndex;
      let key = action.key;
      let onChangeIndex = data.findIndex(
        data => data.editableIndex == recordId
      );
      data[onChangeIndex][key] = action.value;
      if (key == "casualFee") {
        data[onChangeIndex]["casualGst"] = (action.value) / 10
      }
      if (key == "seasonalFee") {
        data[onChangeIndex]["seasonalGst"] = (action.value) / 10
      }
      return {
        ...state,
        error: null
      };

    ///////////add new membership type in the membership form
    case ApiConstants.ADD_NEW_MEMBERSHIP_TYPE:
      state.getDefaultMembershipProductTypes.push(action.newObject);
      return {
        ...state, error: null
      };

    /////get the membership product discount Types
    case ApiConstants.API_MEMBERSHIP_PRODUCT_DISCOUNT_TYPE__LOAD:
      return { ...state, onLoad: true, error: null };

    case ApiConstants.API_MEMBERSHIP_PRODUCT_DISCOUNT_TYPE_SUCCESS:
      return {
        ...state,
        onLoad: false,
        membershipProductDiscountType: action.result.id,
        status: action.status, error: null
      };

    case ApiConstants.API_GET_REG_FORM_SUCCESS:
      let productList = action.MembershipProductList.id;
      let objValue = JSON.parse(JSON.stringify([newObjvalue]))
      let formData = action.result.length > 0 ? action.result : objValue
      let selectedInvitees = checkSlectedInvitees(formData[0].registrationSettings)
      console.log(selectedInvitees)
      state.selectedInvitees = selectedInvitees
      let productListValue = getProductArr(
        productList,
        formData[0].membershipProductTypes
      );
      let SelectedProduct = getFillteredData(
        formData,
        productListValue,
        state.selectedMemberShipType
      );
      let trainingSelection = getSelectedCheck(
        regFormChecked, formData
      )
      state.defaultChecked = trainingSelection
      newObjvalue.competitionUniqueKeyId = state.defaultCompetitionID
      state.sendRegistrationFormData = JSON.parse(JSON.stringify([newObjvalue]))
      return {
        ...state,
        onLoad: false,
        getRegFormCompetition: action.result,
        membershipProductTypes: productListValue,
        selectedProductName: SelectedProduct,
        error: null,
        registrationFormData:
          action.result.length > 0
            ? action.result
            : state.sendRegistrationFormData
      };


    case ApiConstants.API_UPDATE_REG_FORM_LOAD:
      console.log(action)


      if (state.registrationFormData == 0) {
        state.registrationFormData = JSON.parse(JSON.stringify([newObjvalue]));
      }
      if (action.key == "selectedkeys") {
        state.selectedInvitees = action.updatedData
      }
      else {
        let oldData = state.registrationFormData;
        let updatedValue = action.updatedData;
        let getKey = action.key;
        oldData[0][getKey] = updatedValue;
      }
      return { ...state, error: null };


    ///******fail and error handling */

    case ApiConstants.API_REGISTRATION_FAIL:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status
      };
    case ApiConstants.API_REGISTRATION_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status
      };

    /******** */
    ///clearing particular reducer data
    case ApiConstants.REG_CLEARING_PARTICULAR_REDUCER_DATA:
      if (action.dataName == "getMembershipProductDetails") {
        state.getMembershipProductDetails = null;
        state.getDefaultMembershipProductTypes = [];
        state.membershipProductId = "";
        state.membershipProductFeesTableData = null;
        state.membershipProductDiscountData.membershipProductDiscounts[0].discounts = [];
      }
      if (action.dataName == "getRegistrationFormDetails") {
        console.log(newObjvalue)
        state.selectedMemberShipType = [];
        state.selectedMemberShipType = [];
        state.membershipProductTypes = [];
        state.selectedProductName = [];
        state.registrationFormData = JSON.parse(JSON.stringify([newObjvalue]));
        state.defaultChecked['replyName'] = false
        state.defaultChecked['replyRole'] = false
        state.defaultChecked['replyEmail'] = false
        state.defaultChecked['replyPhone'] = false
        state.defaultChecked['replyContactVisible'] = false
        state.defaultChecked["venueVisible"] = false
        state.defaultChecked['daysVisible'] = false
        state.defaultChecked['trainingVisible'] = false

      }
      if (action.dataName == "allDivisionsData") {
        state.allDivisionsData = []
      }
      return {
        ...state, error: null
      };

    ////////
    case ApiConstants.API_COMPETITION_TYPE_LIST_SUCCESS:
      if (isArrayNotEmpty(action.result)) {
        state.registrationFormData[0].competitionUniqueKeyId =
          action.result.length > 0 ? action.result[0].competitionId : "";
      }
      else {
        state.registrationFormData[0].competitionUniqueKeyId = ''
      }
      return {
        ...state, error: null
      };


    case ApiConstants.API_REG_FORM_MEMBERSHIP_PRODUCT_LOAD:
      return { ...state, onLoad: true, error: null };

    case ApiConstants.API_REG_FORM_MEMBERSHIP_PRODUCT_SUCCESS:
      return {
        ...state,
        onLoad: false,
        membershipProductTypes: action.result.id,
        status: action.status, error: null
      };

    case ApiConstants.REG_FORM_UPDATE_MEMBERSHIP_CATEGORY:
      let selectedKeyArr = state.selectedProductName;
      let categoryData = state.membershipProductTypes;
      let updatedTypesData = getNewProdcutData(
        categoryData,
        action.selectedCategory
      );
      state.selectedMemberShipType = updatedTypesData;
      state.selectedProductName = action.selectedCategory;

      return { ...state, error: null };

    ////add another discount in the membership fees
    case ApiConstants.ADD_ANOTHER_DISCOUNT_MEMBERSHIP_FEES:
      if (action.keyAction == "add") {
        const newObj = {
          "membershipProductTypeMappingId": "Select",
          "membershipProductTypeDiscountId": 0,
          "membershipPrdTypeDiscountTypeRefId": 1,
          "amount": "",
          "description": "",
          "availableFrom": null,
          "availableTo": null,
          "discountTypeRefId": 1,
          "discountCode": "",
          "applyDiscount": 0,
          "question": "",
          "childDiscounts": []
        }
        state.membershipProductDiscountData.membershipProductDiscounts[0].discounts.push(newObj)
      }
      else if (action.keyAction == "remove") {
        state.membershipProductDiscountData.membershipProductDiscounts[0].discounts.splice(action.index, 1)
      }
      return {
        ...state,
        error: null
      };

    ///updated discount in membership fees section
    case ApiConstants.UPDATE_DISCOUNT_DATA_MEMBERSHIP_FEES:
      state.membershipProductDiscountData.membershipProductDiscounts[0].discounts = action.discountData
      return {
        ...state,
        error: null
      };

    ///membership fees radip apply fees on change
    case ApiConstants.ON_CHANGE_RADIO_APPLY_FEES_MEMBERSHIP_FEES:
      state.membershipProductFeesTableData.membershipFees[action.feesIndex].membershipProductFeesTypeRefId = action.radioApplyId
      return {
        ...state,
        error: null
      };

    ///membership fees radip apply fees on change
    case ApiConstants.ON_CHANGE_RADIO_APPLY_FEES_MEMBERSHIP_FEES:
      state.membershipProductFeesTableData.membershipFees[action.feesIndex].membershipProductFeesTypeRefId = action.radioApplyId
      return {
        ...state,
        error: null
      };


    ////age mandate and membershipTypes onchange selection checkbox
    case ApiConstants.ON_CHANGE_SELECTION_MEM_TYPE_AGE_MANDATE_CHECKBOX:
      if (action.keyword == "isMandate") {
        state.getDefaultMembershipProductTypes[action.index].isMandate = action.checkedValue

      }
      if (action.keyword == "isMemebershipType") {
        state.getDefaultMembershipProductTypes[action.index].isMemebershipType = action.checkedValue
      }

      return {
        ...state,
        error: null
      };


    ///////onchange date data in age restriction in the membership types
    case ApiConstants.ON_CHANGE_DATE_AGE_MANDATE_MEMBERSHIP_TYPES:
      state.getDefaultMembershipProductTypes = action.data
      return {
        ...state,
        error: null
      };

    //////////remove custom membership type from the membership fees
    case ApiConstants.REMOVE_CUSTOM_MEMBERSHIP_FEES_TYPE:
      state.getDefaultMembershipProductTypes.splice(action.index, 1)
      return {
        ...state,
        error: null
      };

    case ApiConstants.REG_FORM_UPDATE_MEMBERSHIP_PRODUCT_TYPES:
      let productsData = state.selectedMemberShipType;

      let getFormValue = state.registrationFormData;
      let tableValue = action.tableKey;
      let matchIndexKey = action.matchkey;

      productsData[matchIndexKey].membershipProductTypes[tableValue].isSelected = action.isSelected;
      productsData[matchIndexKey].membershipProductTypes[tableValue].registrationLock = action.registrationLock;
      let selectedArray = makeFinalProductArr(productsData);
      getFormValue[0].membershipProductTypes = selectedArray;
      state.selectedMemberShipType = productsData;
      return { ...state, error: null };

    case ApiConstants.REG_FORM_UPDATE_MEMBERSHIP_REGISTRATIONLOCK:
      let Form_Value = state.registrationFormData;
      let product_Data = state.selectedMemberShipType;
      let table_Value = action.table_key;
      let match_Key = action.matchValue;
      product_Data[match_Key].membershipProductTypes[table_Value].isSelected = action.isSelected;
      product_Data[match_Key].membershipProductTypes[table_Value].registrationLock = action.registrationLock;
      let selected_Array = makeFinalProductArr(product_Data);
      Form_Value[0].membershipProductTypes = selected_Array;
      state.selectedMemberShipType = product_Data;
      return { ...state, error: null };


    case ApiConstants.API_YEAR_LIST_SUCCESS:
      if (isArrayNotEmpty(action.competetionListResult)) {
        let defaultCompetition = action.competetionListResult[0].competitionId
        state.defaultCompetitionID = defaultCompetition
        if (newObjvalue.competitionUniqueKeyId.length > 0) {
          newObjvalue.competitionUniqueKeyId = defaultCompetition
        }
      }
      return { ...state, error: null }



    case ApiConstants.REG_FORM_UPDATE_DISCLAIMER_TEXT:
      state.registrationFormData[0].registrationDisclaimer[action.index][action.key] = action.value
      return { ...state, error: null }


    case ApiConstants.REG_FORM_CHECKED_VISIBLE:
      let visibleKey = action.key
      if (visibleKey == "trainingVisible") {
        state.defaultChecked[visibleKey] = action.checked
        state.defaultChecked["venueVisible"] = false
        state.defaultChecked['daysVisible'] = false
        state.registrationFormData[0]["trainingDaysAndTimes"] = ''
        state.registrationFormData[0]["trainingVenueId"] = null
      }
      else {
        state.defaultChecked[visibleKey] = action.checked
        if (visibleKey == "daysVisible") {
          state.registrationFormData[0]["trainingDaysAndTimes"] = ''
        }
        else {
          state.registrationFormData[0]["trainingVenueId"] = null
        }
      }
      return { ...state, error: null }

    case ApiConstants.REG_FORM_REPLY_CHECKED_VISIBLE:
      let replyVisibleKey = action.key
      if (replyVisibleKey == "replyContactVisible") {
        state.defaultChecked[replyVisibleKey] = action.checked
        state.defaultChecked['replyName'] = false
        state.defaultChecked['replyRole'] = false
        state.defaultChecked['replyEmail'] = false
        state.defaultChecked['replyPhone'] = false
        state.registrationFormData[0]["replyName"] = ''
        state.registrationFormData[0]["replyRole"] = ''
        state.registrationFormData[0]["replyEmail"] = ''
        state.registrationFormData[0]["replyPhone"] = ''
      }
      else {
        state.defaultChecked[replyVisibleKey] = action.checked
        state.registrationFormData[0][replyVisibleKey] = ''
      }
      return { ...state, error: null }

    ////////get the divisions list on the basis of year and competition
    case ApiConstants.API_GET_DIVISIONS_LIST_ON_YEAR_AND_COMPETITION_LOAD:
      return { ...state, onLoad: true, error: null };

    case ApiConstants.API_GET_DIVISIONS_LIST_ON_YEAR_AND_COMPETITION_SUCCESS:
      return {
        ...state,
        onLoad: false,
        allDivisionsData: isArrayNotEmpty(action.result) ? action.result : [],
        status: action.status, error: null
      };



    default:
      return state;
  }
}

export default registration;
