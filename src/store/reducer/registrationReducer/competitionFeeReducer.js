import ApiConstants from "../../../themes/apiConstants";
import history from "../../../util/history";
import { getRegistrationSetting } from "../../objectModel/getRegSettingObject";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../../util/helpers";
import { getUserId } from "../../../util/sessionStorage"

// dummy object of competition detail
const competitionDetailObject = {
    competitionUniqueKey: "",
    competitionName: "",
    description: "",
    competitionTypeRefId: 1,
    competitionFormatRefId: 1,
    startDate: null,
    noOfRounds: "",
    roundInDays: "",
    roundInHours: "",
    roundInMins: "",
    registrationCloseDate: null,
    competitionLogoUrl: null,
    minimunPlayers: "",
    maximumPlayers: "",
    venues: [],
    nonPlayingDates: [],
    invitees: [],
    selectedVenuesIds: [],
    logoIsDefault: false,
    yearRefId: 1,


}



const paymentOptionObject = {
    paymentOptions: [],
    charityRoundUp: []
}
const discountObject = {
    competitionDiscounts: [],
    govermentVouchers: []
}

const initialState = {
    onLoad: false,
    getCompAllDataOnLoad: false,
    error: null,
    result: null,
    status: 0,
    regCompetitionFeeListData: [], ////////registration competiton fees list
    regCompetitonFeeListPage: 1,
    regCompetitonFeeListTotalCount: 1,
    competitionDetailData: competitionDetailObject,
    competitionMembershipProductData: null,
    competitionDivisionsData: null,
    competitionFeesData: [],
    competitionPaymentsData: paymentOptionObject,
    competitionDiscountsData: discountObject,
    competitionId: "",
    defaultCompFeesMembershipProduct: null,
    venueList: [],
    postVenues: [],
    postInvitees: [],
    casualPaymentDefault: [],
    seasonalPaymentDefault: [],
    SelectedSeasonalFee: [],
    selectedCasualFee: [],
    selectedCasualFeeKey: [],
    SelectedSeasonalFeeKey: [],
    charityRoundUp: [],
    govtVoucher: [],
    competionDiscountValue:
    {
        "competitionId": "",
        "competitionDiscounts": [
            {
                "discounts": []
            }
        ]
    },
    defaultDiscountType: [],
    selectedInvitees: [],
    selectedVenues: [],
    getCompetitionFeeDetails: [],
    discountMembProductKey: [],
    selectedProductType: [],
    defaultSelectedCasualFee: [],
    defaultSelectedSeasonalFee: [],
    selectedCharityArray: [],
    defaultChairtyOption: [],
    defaultGovtVoucher: [],
    defaultCompFeesOrgLogo: null,
    defaultCompFeesOrgLogoData: null,
    newVenueObj: {
        id: null,
        name: null,
        street1: null,
        street2: null,
        suburb: null,
        stateRefId: null,
        postalCode: null,
        contactNumber: null,
        statusRefId: 1,
        createdBy: null,
        createdOn: "2020-02-17T05:00:06.000Z",
        updatedBy: null,
        updatedOn: null,
        isDeleted: 0,
        lat: null,
        lng: null,
        isEventSpecific: 0,
    },
    competitionCreator: null

};

/////function to append isselected values in default membership types array
function getDefaultCompMemberhsipProduct(data, apiSelectedData) {
    let compMembershipProductTempArray = []
    if (data) {
        let getmembershipProducts = data
        for (let i in getmembershipProducts) {
            let statusData = checkMembershipProductData(getmembershipProducts[i], apiSelectedData.membershipProducts)
            if (statusData.status == false) {
                getmembershipProducts[i]["isProductSelected"] = false;
            }
            else {
                getmembershipProducts[i]["isProductSelected"] = true;
                getmembershipProducts[i]["competitionMembershipProductId"] = statusData.competitionMembershipProductId;
            }
            if (isArrayNotEmpty(getmembershipProducts[i].membershipProductTypes)) {
                for (let j in getmembershipProducts[i].membershipProductTypes) {
                    if (!checkMembershipProductTypes(getmembershipProducts[i].membershipProductTypes[j], statusData.types)) {
                        getmembershipProducts[i].membershipProductTypes[j]["isTypeSelected"] = false;
                    }
                    else {
                        getmembershipProducts[i].membershipProductTypes[j]["isTypeSelected"] = true;
                        getmembershipProducts[i].membershipProductTypes[j]["competitionMembershipProductId"] = statusData.competitionMembershipProductId;
                    }
                }
            }

        }
        compMembershipProductTempArray = getmembershipProducts
    }
    return compMembershipProductTempArray
}

////////function for pushing data selected by the user 
function checkMembershipProductTypes(productType, typesArray) {
    let status = false
    for (let i in typesArray) {
        if (productType.membershipProductTypeMappingId === typesArray[i].membershipProductTypeMappingId) {
            status = true
            break
        }
    }
    return status
}


//////function for pushing data selected by the user 
function checkMembershipProductData(product, apiSelectedData) {
    let status = false
    let types = []
    let competitionMembershipProductId = null

    for (let i in apiSelectedData) {
        if (product.membershipProductUniqueKey === apiSelectedData[i].membershipProductUniqueKey) {
            status = true
            types = apiSelectedData[i].membershipProductTypes
            competitionMembershipProductId = apiSelectedData[i].competitionMembershipProductId
            break
        }
    }
    return { status: status, types: types, competitionMembershipProductId: competitionMembershipProductId }
}


function checkDivision(divisionArray, membershipProductUniqueKey) {
    let divisions = []
    for (let i in divisionArray) {
        if (membershipProductUniqueKey === divisionArray[i].membershipProductUniqueKey) {
            if (!isArrayNotEmpty(divisionArray[i].divisions)) {
                divisions = []
                break
            } else {
                let tempDivisionArray = divisionArray[i].divisions
                for (let j in tempDivisionArray) {
                    if (isNullOrEmptyString(tempDivisionArray[j].fromDate) && isNullOrEmptyString(tempDivisionArray[j].toDate)) {
                        tempDivisionArray[j]["ageRestriction"] = true;
                    }
                    else {
                        tempDivisionArray[j]["ageRestriction"] = false;
                    }
                }
                divisions = tempDivisionArray
                break
            }
        }
    }
    return divisions
}

/////function to append isselected age restriction in the division section table
function getDivisionTableData(data) {
    let compDivisionTempArray = []
    let selectedMebershipProductArray = data.competitionmembershipproduct.membershipProducts
    let compDivisionArray = data.competitiondivisions.competitionFeeDivision
    if (selectedMebershipProductArray) {
        for (let i in selectedMebershipProductArray) {
            compDivisionTempArray.push({
                divisions: checkDivision(compDivisionArray, selectedMebershipProductArray[i].membershipProductUniqueKey),
                membershipProductName: selectedMebershipProductArray[i].membershipProductName,
                membershipProductUniqueKey: selectedMebershipProductArray[i].membershipProductUniqueKey,
                competitionMembershipProductId: selectedMebershipProductArray[i].competitionMembershipProductId
            })
        }
    }
    return compDivisionTempArray

}

//for check selected Charity
function checkSelectedCharity(selected, data) {
    for (let i in data) {
        if (selected) {
            for (let j in selected) {
                if (data[i].id == selected[j].charityRoundUpRefId) {
                    data[i]["isSelected"] = true;

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

//get charity result
function getCharityResult(data) {
    let newCharityResult = []
    if (isArrayNotEmpty(data)) {
        for (let i in data) {
            data[i]["isSelected"] = false
        }
        newCharityResult = data
    }
    return newCharityResult

}


function checkSelectedVoucher(selected, data) {
    for (let i in data) {
        if (selected) {
            for (let j in selected) {
                if (data[i].id == selected[j].governmentVoucherRefId) {
                    data[i]["isSelected"] = true;

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

//for get selected membership product
function getSelectedDiscountProduct(data, productData) {
    let productDataArr = productData.membershipProducts
    let selectedDiscountProduct = []
    for (let i in productDataArr) {
        if (productDataArr[i].membershipProductUniqueKey == data) {
            if (isArrayNotEmpty(productDataArr[i].membershipProductTypes)) {
                selectedDiscountProduct = productDataArr[i].membershipProductTypes
            }
            else {
                selectedDiscountProduct = []
            }
        }
    }
    return selectedDiscountProduct
}

//for get discount data
function discountDataObject(data) {
    let discountArray = []
    let competitionFeeDiscountsArr = data.competitionDiscounts
    if (competitionFeeDiscountsArr !== null) {
        if (competitionFeeDiscountsArr[0].discounts) {
            discountArray = competitionFeeDiscountsArr[0].discounts
        } else {
            discountArray = []
        }
    } else {
        discountArray = []
    }
    return discountArray
}

// for  updated selected seasonal fee array
function getUpdatedSeasonalFee(value, getUpdatedSeasonalFeeArr) {
    for (let i in value) {
        if (value[i] == 5) {
        } else {
            let settingObj = {
                "subOptions": [],
                "feesTypeRefId": '2',
                "paymentOptionRefId": value[i]
            }
            getUpdatedSeasonalFeeArr.push(settingObj)
        }
    }
    return getUpdatedSeasonalFeeArr
}
// get selected casual fee payment option key
function checkSelectedCasualFee(paymentData, casualFee, selectedCasualFee, selectedCasualFeeKey) {
    selectedCasualFeeKey = []
    if (paymentData) {
        for (let i in paymentData) {
            if (paymentData[i].feesTypeRefId == 1) {
                selectedCasualFeeKey.push(paymentData[i].paymentOptionRefId)
                selectedCasualFee.push(paymentData[i])
            }
        }
        return {
            selectedCasualFeeKey,
            selectedCasualFee
        }
    } else {
        return {
            selectedCasualFeeKey,
            selectedCasualFee
        }
    }
}


// get selected Seasonal fee payment option key
function checkSelectedSeasonalFee(paymentDataArray, seasonalFee, selectedSeasonalFee, selectedSeasonalFeeKey) {
    selectedSeasonalFeeKey = []
    if (paymentDataArray) {
        for (let i in paymentDataArray) {
            if (paymentDataArray[i].feesTypeRefId == 2) {
                selectedSeasonalFeeKey.push(paymentDataArray[i].paymentOptionRefId)
                selectedSeasonalFee.push(paymentDataArray[i])
            }
        }
        return {
            selectedSeasonalFeeKey,
            selectedSeasonalFee
        }

    }
    else {
        return {
            selectedSeasonalFeeKey,
            selectedSeasonalFee,
        }
    }
}


// for  updated selected Casual fee array
function getUpdatedCasualFee(value, getUpdatedCasualFeeArr, allDataCasualFee, key) {
    for (let i in value) {
        if (allDataCasualFee.length > 0) {
            for (let j in allDataCasualFee) {
                if (value[i] == allDataCasualFee[j].paymentOptionRefId) {
                    let object = {
                        "subOptions": [],
                        "feesTypeRefId": allDataCasualFee[j].feesTypeRefId,
                        "paymentOptionRefId": allDataCasualFee[j].paymentOptionRefId,
                        "paymentOptionId": allDataCasualFee[j].paymentOptionId
                    }
                    getUpdatedCasualFeeArr.push(object)
                    break
                } else {
                    if (value[i] == 5) {
                    }
                    else {
                        let object = {
                            "subOptions": [],
                            "feesTypeRefId": key,
                            "paymentOptionRefId": value[i],
                            "paymentOptionId": 0
                        }
                        getUpdatedCasualFeeArr.push(object)
                        break
                    }
                }
            }
        }
        else {
            if (value[i] == 5) {
            } else {
                let object = {
                    "subOptions": [],
                    "feesTypeRefId": key,
                    "paymentOptionRefId": value[i],
                    "paymentOptionId": 0
                }
                getUpdatedCasualFeeArr.push(object)
                break
            }
        }
    }
    return getUpdatedCasualFeeArr
}

//// selected venues id for display
function checkSelectedVenue(details, venues) {

    let filteredVeneu = []
    for (let i in venues) {
        for (let j in details) {
            if (venues[i].id == details[j].venueId) {
                filteredVeneu.push(venues[i].id)

                break;
            }
        }
    }
    return filteredVeneu

}

//// check existing Venues
function checkExistingVenues(venuesArr, venueID) {
    let object = {
        status: false,
        result: []
    }

    if (venuesArr) {
        for (let i in venuesArr) {
            if (venuesArr[i].venueId == venueID) {
                object = {
                    status: true,
                    result: venuesArr[i]
                }

                break
            }
        }
    }

    return object
}



/// Create velue list object and ids
function createVenuesList(venueList, selectedList, currentArray) {
    let postArr = []
    for (let i in selectedList) {
        let selectedVenues = checkExistingVenues(currentArray, selectedList[i])
        let venuesObject = null

        if (selectedVenues.status == false) {
            venuesObject = {
                "competitionVenueId": 0,
                "venueId": selectedList[i]
            }
        } else {
            venuesObject = {
                "competitionVenueId": selectedVenues.result.competitionVenueId,
                "venueId": selectedList[i]
            }
        }


        postArr.push(venuesObject)


    }
    return postArr;

}



function checkSlectedInvitees(array) {

    let selected = []
    if (array) {
        for (let i in array) {
            selected.push(array[i].registrationInviteesRefId)
        }
    }
    return selected

}


function checkExistingInvitees(getInviteesArr, inviteesID) {
    let object = {
        status: false,
        result: []
    }

    if (getInviteesArr) {
        for (let i in getInviteesArr) {
            if (getInviteesArr[i].registrationInviteesRefId == inviteesID) {
                object = {
                    status: true,
                    result: getInviteesArr[i]
                }

                break
            }
        }
    }

    return object
}

function checkCharity(charityID, defaultCharityArr) {
    let charity = {
        status: false,
        result: []
    }

    for (let i in defaultCharityArr) {
        if (defaultCharityArr[i].charityRoundUpRefId == charityID) {
            charity = {
                status: true,
                result: defaultCharityArr[i]

            }
        }
    }
    return charity
}

function checkVoucher(voucherId, defaultVoucher) {
    let vocuher = {
        status: false,
        result: []
    }
    for (let i in defaultVoucher) {
        if (defaultVoucher[i].governmentVoucherRefId == voucherId) {
            vocuher = {
                status: true,
                result: defaultVoucher[i]

            }

        }
    }
    return vocuher
}

function checkCharityArray(selectedArr, defaultCharityArr) {
    let slectedArray = []
    let postCharityArr = []
    let charityObj = null
    for (let i in selectedArr) {
        if (selectedArr[i].isSelected == true) {
            slectedArray.push(selectedArr[i])
        }
    }

    for (let i in slectedArray) {
        let charityObjectArray = checkCharity(slectedArray[i].id, defaultCharityArr)
        if (charityObjectArray.status == true) {
            charityObj = {
                charityRoundUpId: charityObjectArray.result.charityRoundUpId,
                charityRoundUpRefId: slectedArray[i].id
            }
        }
        else {
            charityObj = {
                charityRoundUpId: 0,
                charityRoundUpRefId: slectedArray[i].id,
            }
        }
        postCharityArr.push(charityObj)
    }
    return postCharityArr
}

function checkVoucherArray(voucherArr, defaultGovtVoucher) {
    let selectedArray = []
    let postVoucherArr = []
    let charityObj = null
    for (let i in voucherArr) {
        if (voucherArr[i].isSelected == true) {
            selectedArray.push(voucherArr[i])
        }
    }



    for (let i in selectedArray) {
        let voucherObjectArray = checkVoucher(selectedArray[i].id, defaultGovtVoucher)
        if (voucherObjectArray.status == true) {
            charityObj = {
                competitionGovernmentVoucherId: voucherObjectArray.result.competitionGovernmentVoucherId,
                governmentVoucherRefId: selectedArray[i].id
            }
        }
        else {
            charityObj = {
                competitionGovernmentVoucherId: 0,
                governmentVoucherRefId: selectedArray[i].id,
            }


        }
        postVoucherArr.push(charityObj)
    }

    return postVoucherArr
}

function createInviteesPostArray(selectedInvitees, getInvitees) {

    let invitessObjectArr = []
    for (let i in selectedInvitees) {
        let selectedInviteesArray = checkExistingInvitees(getInvitees, selectedInvitees[i])
        let inviteesObject = null
        if (selectedInviteesArray.status == true) {
            inviteesObject = {
                "inviteesId": selectedInviteesArray.result.inviteesId,
                "registrationInviteesRefId": selectedInvitees[i]
            }
        } else {
            inviteesObject = {
                "inviteesId": 0,
                "registrationInviteesRefId": selectedInvitees[i]
            }
        }

        invitessObjectArr.push(inviteesObject)
    }
    return invitessObjectArr
}



function getMemberShipProductTypes(key, productsArr) {
    let productTypes = []
    for (let i in productsArr) {
        if (productsArr[i].membershipProductUniqueKey === key) {
            productTypes = productsArr[i].membershipProductTypes
        }
    }
    return productTypes
}


function checkFeeDivisionType(data, uniqueKey) {
    let array = []
    for (let i in data) {
        if (data[i].membershipProductUniqueKey == uniqueKey) {
            array = data[i].fees
        }
    }
    return array
}


function checkStatus(getCompetitionFeeArray, item, divisionId, feeTypeRefId) {

    let object = {
        status: false,
        result: []
    }
    for (let i in getCompetitionFeeArray) {
        if (getCompetitionFeeArray[i].competitionMembershipProductTypeId == item.competitionMembershipProductTypeId &&
            getCompetitionFeeArray[i].feeTypeRefId == feeTypeRefId
            && getCompetitionFeeArray[i].competitionMembershipProductDivisionId == divisionId) {
            object = {
                status: true,
                result: getCompetitionFeeArray[i]
            }
            break;
        }
    }


    return object

}

function removeDuplicacyInFeeArray(feeArray) {
    let feesProductArray = feeArray
    for (let i in feeArray) {
        let feesList = isArrayNotEmpty(feeArray[i].fees) ? feeArray[i].fees : []
        const filteredArr = feesList.reduce((acc, current) => {
            const x = acc.find((item) => {
                return item.competitionMembershipProductTypeId === current.competitionMembershipProductTypeId &&
                    item.competitionMembershipProductDivisionId === current.competitionMembershipProductDivisionId &&
                    item.feeTypeRefId === current.feeTypeRefId &&
                    item.organisationId === current.organisationId
            });

            if (!x) {
                return acc.concat([current]);
            } else {

                return acc;
            }
        }, []);

        feesProductArray[i].fees = filteredArr
    }
    return feesProductArray
}



function childFeesMapping(getFeeData) {
    let mainFeeArray = getFeeData
    for (let i in mainFeeArray) {
        let parentFeesList = isArrayNotEmpty(mainFeeArray[i].fees) ? mainFeeArray[i].fees : []
        let childrenFeesList = isArrayNotEmpty(mainFeeArray[i].childFees) ? isArrayNotEmpty(mainFeeArray[i].childFees)
            ? mainFeeArray[i].childFees : [] : []
        console.log("parentFeesList", parentFeesList, "childrenFeesList", childrenFeesList)
        childrenFeesList.map((childItem, childIndex) => {
            childItem['affiliateFee'] = childItem.Fees
            childItem['affiliateGst'] = childItem.GST
            childItem['Fees'] = parentFeesList[childIndex].Fees
            childItem['GST'] = parentFeesList[childIndex].GST
            childItem['feeTypeRefId'] = parentFeesList[childIndex].feeTypeRefId
            childItem['competitionMembershipProductDivisionId'] = parentFeesList[childIndex].competitionMembershipProductDivisionId

        })
        mainFeeArray[i].fees = mainFeeArray[i].childFees
    }
    return mainFeeArray
}

/////get the all total fees 
function getTotalFees(feesOwner, data, mFees) {
    let totalFees = 0
    let dataFees = parseInt(data.Fees)
    let dataGst = parseInt(data.GST)
    let dataAffiliateFees = data.affiliateFee == null ? 0 : parseInt(data.affiliateFee)
    let dataAffiliateGst = data.affiliateGst == null ? 0 : parseInt(data.affiliateGst)
    if (!feesOwner) {
        totalFees = (dataFees + dataGst + dataAffiliateFees + dataAffiliateGst + mFees).toFixed(2)
        return totalFees
    } else {
        totalFees = (dataFees + dataGst + mFees).toFixed(2)
        return totalFees
    }
}



///// check Fee Type ---- 

function checkFeeType(feeArray) {

    for (let i in feeArray) {
        if (feeArray[i].fee && feeArray[i].gst) {
            return true
        } else {
            return false
        }
    }

}


///// check Fee Type ---- 

function checkIsDivisionAllType(productArray) {
console.log(productArray)
    for (let i in productArray) {
        if (productArray[i].competitionMembershipProductDivisionId==null) {
            return null
            
        } else {
            return productArray[i].competitionMembershipProductDivisionId
        }
        
    }
    
}



/// create product array 

function createProductFeeArr(data) {
    var getFeeData = isArrayNotEmpty(data.competitionfees) ? data.competitionfees : []

    let creatorId = data.competitiondetail.competitionCreator
    let userId = getUserId();
    let feesOwner = creatorId !== JSON.parse(userId) ? false : true
    if (!feesOwner) {
        let childFeesMappedArray = isArrayNotEmpty(data.competitionfees) ? childFeesMapping(data.competitionfees) : []
        getFeeData = childFeesMappedArray
    }

    let product = data.competitionmembershipproduct.membershipProducts
    let divisions = data.competitiondivisions.competitionFeeDivision

    let removeDuplicacyFeeArray = removeDuplicacyInFeeArray(getFeeData)
    getFeeData = removeDuplicacyFeeArray
    console.log("Test Array**************", getFeeData)

    let productArray = []
    for (let i in divisions) {
        let tempDivisionArray = checkFeeDivisionType(getFeeData, divisions[i].membershipProductUniqueKey)
        let getDivisionsArray = isArrayNotEmpty(tempDivisionArray) ? tempDivisionArray : []


        let memberShipProductType = getMemberShipProductTypes(divisions[i].membershipProductUniqueKey, product)

        let alltypeArraySeasonal = []
        let perTypeArraySeasonal = []
        let alltypeArrayCasual = []
        let perTypeArrayCasual = []

        for (let j in memberShipProductType) {
            let statusSeasonal = checkStatus(getDivisionsArray, memberShipProductType[j], null, 2)
            let statusCasual = checkStatus(getDivisionsArray, memberShipProductType[j], null, 1)

            let type_Object_casual = null
            let type_Object_seasonal = null

            ////// CASUAL OBJECT
            if (statusCasual.status == true) {
                let mFeesCasual = parseInt(memberShipProductType[j].mCasualFee) + parseInt(memberShipProductType[j].mCasualGst)
                type_Object_casual = {
                    "competitionMembershipProductFeeId": statusCasual.result.competitionMembershipProductFeeId,
                    "competitionMembershipProductTypeId": statusCasual.result.competitionMembershipProductTypeId,
                    "competitionMembershipProductDivisionId": null,
                    "fee": statusCasual.result.Fees,
                    "gst": statusCasual.result.GST,
                    "affiliateFee": statusCasual.result.affiliateFee,
                    "affiliateGst": statusCasual.result.affiliateGst,
                    "feeTypeRefId": statusCasual.result.feeTypeRefId,
                    "membershipProductTypeName": memberShipProductType[j].membershipProductTypeName,
                    "membershipProductUniqueKey": divisions[i].membershipProductUniqueKey,
                    "total": getTotalFees(feesOwner, statusCasual.result, mFeesCasual),
                    "mFees": mFeesCasual
                }
            } else {
                type_Object_casual = {
                    "competitionMembershipProductFeeId": 0,
                    "competitionMembershipProductTypeId": memberShipProductType[j].competitionMembershipProductTypeId,
                    "competitionMembershipProductDivisionId": null,
                    "fee": "",
                    "gst": "",
                    "affiliateFee": "",
                    "affiliateGst": "",
                    "feeTypeRefId": 1,
                    "membershipProductTypeName": memberShipProductType[j].membershipProductTypeName,
                    "membershipProductUniqueKey": divisions[i].membershipProductUniqueKey,
                    "total": null,
                    "mFees": parseInt(memberShipProductType[j].mCasualFee) + parseInt(memberShipProductType[j].mCasualGst)
                }
            }

            //// SEASONAL OBJECT
            if (statusSeasonal.status == true) {
                let mFeesSeasonal = parseInt(memberShipProductType[j].mSeasonalFee) + parseInt(memberShipProductType[j].mSeasonalGst)

                type_Object_seasonal = {
                    "competitionMembershipProductFeeId": statusSeasonal.result.competitionMembershipProductFeeId,
                    "competitionMembershipProductTypeId": memberShipProductType[j].competitionMembershipProductTypeId,
                    "competitionMembershipProductDivisionId": null,
                    "fee": statusSeasonal.result.Fees,
                    "gst": statusSeasonal.result.GST,
                    "affiliateFee": statusSeasonal.result.affiliateFee,
                    "affiliateGst": statusSeasonal.result.affiliateGst,
                    "feeTypeRefId": statusSeasonal.result.feeTypeRefId,
                    "membershipProductTypeName": memberShipProductType[j].membershipProductTypeName,
                    "membershipProductUniqueKey": divisions[i].membershipProductUniqueKey,
                    "total": getTotalFees(feesOwner, statusSeasonal.result, mFeesSeasonal),
                    "mFees": mFeesSeasonal
                }
            } else {
                type_Object_seasonal = {
                    "competitionMembershipProductFeeId": 0,
                    "competitionMembershipProductTypeId": memberShipProductType[j].competitionMembershipProductTypeId,
                    "competitionMembershipProductDivisionId": null,
                    "fee": "",
                    "gst": "",
                    "affiliateFee": "",
                    "affiliateGst": "",
                    "feeTypeRefId": 2,
                    "membershipProductTypeName": memberShipProductType[j].membershipProductTypeName,
                    "membershipProductUniqueKey": divisions[i].membershipProductUniqueKey,
                    "total": null,
                    "mFees": parseInt(memberShipProductType[j].mSeasonalFee) + parseInt(memberShipProductType[j].mSeasonalGst)
                }
            }

            alltypeArraySeasonal.push(type_Object_seasonal)
            alltypeArrayCasual.push(type_Object_casual)
        }


        let divisionProductType = divisions[i].divisions
        for (let j in divisionProductType) {
            for (let k in memberShipProductType) {
                let statusSeasonal = checkStatus(getDivisionsArray, memberShipProductType[k], divisionProductType[j].competitionMembershipProductDivisionId, 2)
                let statusCasual = checkStatus(getDivisionsArray, memberShipProductType[k], divisionProductType[j].competitionMembershipProductDivisionId, 1)

                let type_Object_casual = null
                let type_Object_seasonal = null



                ///// CASUAL TYPE -  DIVIVSION
                if (statusCasual.status == true) {
                    let mFeesCasualPer = parseInt(memberShipProductType[k].mCasualFee) + parseInt(memberShipProductType[k].mCasualGst)
                    type_Object_casual = {
                        "competitionMembershipProductFeeId": statusCasual.result.competitionMembershipProductFeeId,
                        "competitionMembershipProductTypeId": memberShipProductType[k].competitionMembershipProductTypeId,
                        "competitionMembershipProductDivisionId": divisionProductType[j].competitionMembershipProductDivisionId,
                        "fee": statusCasual.result.Fees,
                        "gst": statusCasual.result.GST,
                        "affiliateFee": statusCasual.result.affiliateFee,
                        "affiliateGst": statusCasual.result.affiliateGst,
                        "feeTypeRefId": 1,
                        "membershipProductTypeName": memberShipProductType[k].membershipProductTypeName,
                        "divisionName": divisionProductType[j].divisionName,
                        "membershipProductUniqueKey": divisions[i].membershipProductUniqueKey,
                        "total": getTotalFees(feesOwner, statusCasual.result, mFeesCasualPer),
                        "mFees": mFeesCasualPer
                    }
                } else {
                    type_Object_casual = {
                        "competitionMembershipProductFeeId": 0,
                        "competitionMembershipProductTypeId": memberShipProductType[k].competitionMembershipProductTypeId,
                        "competitionMembershipProductDivisionId": divisionProductType[j].competitionMembershipProductDivisionId,
                        "fee": "",
                        "gst": "",
                        "affiliateFee": "",
                        "affiliateGst": "",
                        "feeTypeRefId": 1,
                        "membershipProductTypeName": memberShipProductType[k].membershipProductTypeName,
                        "divisionName": divisionProductType[j].divisionName,
                        "membershipProductUniqueKey": divisions[i].membershipProductUniqueKey,
                        "total": null,
                        "mFees": parseInt(memberShipProductType[k].mCasualFee) + parseInt(memberShipProductType[k].mCasualGst)
                    }
                }

                if (statusSeasonal.status == true) {
                    let mFeesCasualPer = parseInt(memberShipProductType[k].mSeasonalFee) + parseInt(memberShipProductType[k].mSeasonalGst)

                    type_Object_seasonal = {
                        "competitionMembershipProductFeeId": statusSeasonal.result.competitionMembershipProductFeeId,
                        "competitionMembershipProductTypeId": memberShipProductType[k].competitionMembershipProductTypeId,
                        "competitionMembershipProductDivisionId": divisionProductType[j].competitionMembershipProductDivisionId,
                        "fee": statusSeasonal.result.Fees,
                        "gst": statusSeasonal.result.GST,
                        "affiliateFee": statusSeasonal.result.affiliateFee,
                        "affiliateGst": statusSeasonal.result.affiliateGst,
                        "feeTypeRefId": 2,
                        "membershipProductTypeName": memberShipProductType[k].membershipProductTypeName,
                        "divisionName": divisionProductType[j].divisionName,
                        "membershipProductUniqueKey": divisions[i].membershipProductUniqueKey,
                        "total": getTotalFees(feesOwner, statusSeasonal.result, mFeesCasualPer),
                        "mFees": mFeesCasualPer
                    }
                } else {
                    type_Object_seasonal = {
                        "competitionMembershipProductFeeId": 0,
                        "competitionMembershipProductTypeId": memberShipProductType[k].competitionMembershipProductTypeId,
                        "competitionMembershipProductDivisionId": divisionProductType[j].competitionMembershipProductDivisionId,
                        "fee": "",
                        "gst": "",
                        "affiliateFee": "",
                        "affiliateGst": "",
                        "feeTypeRefId": 2,
                        "membershipProductTypeName": memberShipProductType[k].membershipProductTypeName,
                        "divisionName": divisionProductType[j].divisionName,
                        "membershipProductUniqueKey": divisions[i].membershipProductUniqueKey,
                        "total": null,
                        "mFees": parseInt(memberShipProductType[k].mSeasonalFee) + parseInt(memberShipProductType[k].mSeasonalGst)
                    }
                }
                perTypeArrayCasual.push(type_Object_casual)
                perTypeArraySeasonal.push(type_Object_seasonal)
            }

        }

        let productArrayToCheckAllType = isArrayNotEmpty(getFeeData) ? getFeeData : []
        let divisionIdToCheckAllType = null
        for( let x in productArrayToCheckAllType){
            if(product[i].membershipProductUniqueKey == productArrayToCheckAllType[x].membershipProductUniqueKey){
                divisionIdToCheckAllType = checkIsDivisionAllType(productArrayToCheckAllType[x].fees)
                product[i]["isProductTypeALL"] = divisionIdToCheckAllType? true :false
                console.log("divisionIdToCheckAllType", divisionIdToCheckAllType)
                break;
            }
           
        }
        let isSeasonalFeeTypeAvailable = null
        let isCasualFeeTypeAvailable = null

        if (product[i].isProductTypeALL == false) {
            isSeasonalFeeTypeAvailable = checkFeeType(alltypeArraySeasonal)
            isCasualFeeTypeAvailable = checkFeeType(alltypeArrayCasual)
        } else {
            isSeasonalFeeTypeAvailable = checkFeeType(perTypeArraySeasonal)
            isCasualFeeTypeAvailable = checkFeeType(perTypeArrayCasual)
        }
        let object = {
            "membershipProductName": product[i].membershipProductName,
            "competitionMembershipProductId": product[i].competitionMembershipProductId,
            "membershipProductUniqueKey": product[i].membershipProductUniqueKey,
            "seasonal": { allType: alltypeArraySeasonal, perType: perTypeArraySeasonal },
            "casual": { allType: alltypeArrayCasual, perType: perTypeArrayCasual, perType: perTypeArrayCasual },
            "isAllType": product[i].isProductTypeALL === false ? "allDivisions" : "perDivision",
            "isSeasonal":isSeasonalFeeTypeAvailable,
            "isCasual": isCasualFeeTypeAvailable
        }

        productArray.push(object)
    }
    console.log("Product Array ********************", productArray)
    return productArray
}

/////addd membership product key to the division tab
function competitionMembershipProduct_Id(array, key) {
    let keyValue = null
    let index = array.findIndex(x => x.membershipProductUniqueKey == key)
    if (index > -1) {
        keyValue = array[index].competitionMembershipProductId
    }

    return keyValue
}

///// check selected discount membership product
function checkDiscountProduct(discountStateData, selectedDiscount) {
    let object = {
        status: false,
        result: []
    }
    for (let i in selectedDiscount) {

        if (selectedDiscount[i].competitionTypeDiscountId === discountStateData.competitionTypeDiscountId) {
            object = {
                status: true,
                result: selectedDiscount[i]
            }
            break;
        }
    }
    return object
}


function competitionFees(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.API_COMPETITION_FEES_FAIL:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };

        case ApiConstants.API_COMPETITION_FEES_ERROR:
            return {
                ...state,
                onLoad: false,
                error: action.error,
                status: action.status
            };


        // get the competition fees list in registration
        case ApiConstants.API_REG_COMPETITION_LIST_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_REG_COMPETITION_LIST_SUCCESS:
            let competitionListData = action.result;
            return {
                ...state,
                onLoad: false,
                regCompetitionFeeListData: competitionListData.competitionFees,
                regCompetitonFeeListTotalCount: competitionListData.page.totalCount,
                regCompetitonFeeListPage: competitionListData.page
                    ? competitionListData.page.currentPage
                    : 1,
                status: action.status,
                error: null
            };

        //////delete the competition list product
        case ApiConstants.API_REG_COMPETITION_LIST_DELETE_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_REG_COMPETITION_LIST_DELETE_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        ///get casual feees
        case ApiConstants.GET_CASUAL_FEE_DETAIL_API_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.GET_CASUAL_FEE_DETAIL_API_SUCCESS:
            const casualPayment = getRegistrationSetting(action.casualPaymentOptionResult)
            return {
                ...state,
                onLoad: false,
                status: action.status,
                casualPaymentDefault: casualPayment,
                error: null
            };

        ////get seasoonal fees
        case ApiConstants.GET_SEASONAL_FEE_DETAIL_API_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.GET_SEASONAL_FEE_DETAIL_API_SUCCESS:
            const seasonalPayment = getRegistrationSetting(action.seasonalPaymentOptionResult)
            return {
                ...state,
                onLoad: false,
                status: action.status,
                seasonalPaymentDefault: seasonalPayment,
                error: null
            };

        ////get default competition membershipproduct tab details
        case ApiConstants.API_GET_DEFAULT_COMPETITION_FEES_MEMBERHSIP_PRODUCT_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_GET_DEFAULT_COMPETITION_FEES_MEMBERHSIP_PRODUCT_SUCCESS:
            return {
                ...state,
                status: action.status,
                defaultCompFeesMembershipProduct: getDefaultCompMemberhsipProduct(action.result.data.membershipProducts, []),
                error: null,
                onLoad: false
            };


        /////get the competition fees all the data in one API
        case ApiConstants.API_GET_COMPETITION_FEES_DETAILS_LOAD:

            return { ...state, onLoad: true, error: null, getCompAllDataOnLoad: true };

        case ApiConstants.API_GET_COMPETITION_FEES_DETAILS_SUCCESS:
            let allData = action.result.data
            console.log("allData", allData)
            state.competitionCreator = allData.competitiondetail.competitionCreator
            // state.competitionCreator = 6
            let selectedInvitees = checkSlectedInvitees(allData.competitiondetail.invitees)
            let selectedVenues = checkSelectedVenue(allData.competitiondetail.venues, state.venueList)
            state.selectedVenues = selectedVenues
            state.selectedInvitees = selectedInvitees
            let selectedCasualFee = checkSelectedCasualFee(allData.competitionpayments.paymentOptions, state.casualPaymentDefault, state.selectedCasualFee, state.selectedCasualFeeKey)
            let selectedSeasonalFee = checkSelectedSeasonalFee(allData.competitionpayments.paymentOptions, state.seasonalPaymentDefault, state.SelectedSeasonalFee, state.SelectedSeasonalFeeKey)
            let finalDiscountData = discountDataObject(allData.competitiondiscounts)
            state.competionDiscountValue.competitionDiscounts[0].discounts = finalDiscountData
            let selectedCharity = checkSelectedCharity(allData.competitionpayments.charityRoundUp, state.charityRoundUp)
            let selectedGovtVoucher = checkSelectedVoucher(allData.competitiondiscounts.govermentVouchers, state.govtVoucher)
            state.charityRoundUp = selectedCharity
            state.govtVoucher = selectedGovtVoucher
            state.getCompetitionFeeDetails = allData.competitionfees
            let divisionGetSuccesData = getDivisionTableData(allData)
            state.competitionDivisionsData = divisionGetSuccesData
            state.defaultCompFeesMembershipProduct = getDefaultCompMemberhsipProduct(state.defaultCompFeesMembershipProduct, allData.competitionmembershipproduct)
            let competitionFeeProducts = createProductFeeArr(allData)
            state.competitionFeesData = competitionFeeProducts

            if (isArrayNotEmpty(allData.competitiondiscounts.competitionDiscounts)) {
                let selectDiscountArray = allData.competitiondiscounts.competitionDiscounts[0].discounts
                let discountslist = state.competionDiscountValue.competitionDiscounts[0].discounts
                let memberShipDiscountProduct = []
                for (let i in discountslist) {
                    let selectedProductDiscount = checkDiscountProduct(discountslist[i], selectDiscountArray)
                    if (selectedProductDiscount.status == true) {
                        memberShipDiscountProduct = getSelectedDiscountProduct(selectedProductDiscount.result.membershipProductUniqueKey, allData.competitionmembershipproduct)
                        discountslist[i].competitionMembershipProductTypeId = selectedProductDiscount.result.competitionMembershipProductTypeId
                    }
                    discountslist[i].membershipProductTypes = memberShipDiscountProduct
                }
            }
            state.onLoad = false
            state.getCompAllDataOnLoad = false
            return {
                ...state,
                status: action.status,
                competitionDetailData: allData.competitiondetail,
                competitionMembershipProductData: allData.competitionmembershipproduct,
                competitionPaymentsData: allData.competitionpayments,
                competitionDiscountsData: allData.competitiondiscounts,
                selectedCasualFee: selectedCasualFee.selectedCasualFee,
                selectedCasualFeeKey: selectedCasualFee.selectedCasualFeeKey,
                selectedSeasonalFee: selectedSeasonalFee.selectedSeasonalFee,
                SelectedSeasonalFeeKey: selectedSeasonalFee.selectedSeasonalFeeKey,
                competitionId: allData.competitiondetail.competitionUniqueKey,
                defaultSelectedCasualFee: selectedCasualFee.selectedCasualFee,
                defaultSelectedSeasonalFee: selectedSeasonalFee.selectedSeasonalFee,
                defaultChairtyOption: allData.competitionpayments.charityRoundUp,
                defaultGovtVoucher: allData.competitiondiscounts.govermentVouchers,
                error: null
            };


        ///////get the venue list in the first tab
        case ApiConstants.API_REG_FORM_VENUE_SUCCESS:
            let venue = action.result
            state.venueList = venue
            return {
                ...state,
                error: null
            }



        ////save the competition membership tab details
        case ApiConstants.API_SAVE_COMPETITION_FEES_MEMBERHSIP_TAB_LOAD:
            //s state.defaultCompFeesMembershipProduct = null
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_SAVE_COMPETITION_FEES_MEMBERHSIP_TAB_SUCCESS:
            let savemembershipAllData = action.result.data
            let divisionGetMembershipSuccesData = getDivisionTableData(savemembershipAllData)
            state.competitionDivisionsData = divisionGetMembershipSuccesData
            state.defaultCompFeesMembershipProduct = getDefaultCompMemberhsipProduct(state.defaultCompFeesMembershipProduct, savemembershipAllData.competitionmembershipproduct)

            return {
                ...state,
                onLoad: false,
                status: action.status,
                competitionId: savemembershipAllData.competitiondetail.competitionUniqueKey,
                competitionMembershipProductData: savemembershipAllData.competitionmembershipproduct,
                error: null
            };



        ////membership product selected action tochange membership typearray data
        case ApiConstants.COMPETITION_FEES_MEMBERSHIP_PRODUCT_SELECTED_ONCHANGE:
            state.defaultCompFeesMembershipProduct[action.index].isProductSelected = action.checked

            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };


        //////membership types in competition fees onchhange function
        case ApiConstants.COMPETITION_FEES_MEMBERSHIP_TYPES_SELECTED_ONCHANGE:
            state.defaultCompFeesMembershipProduct[action.membershipIndex].membershipProductTypes[action.typeIndex].isTypeSelected = action.checked
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        /////save the division table data  in the competition fees section
        case ApiConstants.API_SAVE_COMPETITION_FEES_DIVISION_TAB_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_SAVE_COMPETITION_FEES_DIVISION_TAB_SUCCESS:
            let saveDivisionData = action.result.data
            let divisionSaveSuccessData = getDivisionTableData(saveDivisionData)
            state.competitionDivisionsData = divisionSaveSuccessData
            let competitionFeeProductsDivision = createProductFeeArr(saveDivisionData)
            state.competitionFeesData = competitionFeeProductsDivision
            return {
                ...state,
                onLoad: false,
                status: action.status,
                competitionMembershipProductData: saveDivisionData.competitionmembershipproduct,
                error: null
            };


        /////onchange the division table data on change
        case ApiConstants.COMPETITION_FEES_DIVISION_TABLE_DATA_ONCHANGE:
            let onChangeDivisionIndex = state.competitionDivisionsData.findIndex(
                data => data.membershipProductUniqueKey == action.record.membershipProductUniqueKey
            );
            state.competitionDivisionsData[onChangeDivisionIndex].divisions[action.index][action.keyword] = action.checked

            if (action.keyword == "ageRestriction") {
                if (action.checked == false) {
                    state.competitionDivisionsData[onChangeDivisionIndex].divisions[action.index]["fromDate"] = null
                    state.competitionDivisionsData[onChangeDivisionIndex].divisions[action.index]["toDate"] = null
                }
            }
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };

        //////add or remove another division inthe divsision tab
        case ApiConstants.COMPETITION_FEES_DIVISION_ADD_REMOVE:
            // let key = competitionMembershipProduct_Id(state.defaultCompFeesMembershipProduct, action.item.membershipProductUniqueKey)
            if (action.keyword == "add") {
                let defaultDivisionObject = {
                    toDate: null,
                    fromDate: null,
                    divisionName: "",
                    membershipProductUniqueKey: action.item.membershipProductUniqueKey,
                    competitionMembershipProductId: action.item.competitionMembershipProductId,
                    competitionMembershipProductDivisionId: 0,
                    ageRestriction: false,
                }
                state.competitionDivisionsData[action.index].divisions.push(defaultDivisionObject)
            }
            if (action.keyword == "remove") {
                let removeDivisionIndex = state.competitionDivisionsData.findIndex(x => x.membershipProductUniqueKey == action.item.membershipProductUniqueKey)
                if (removeDivisionIndex >= 0) {
                    state.competitionDivisionsData[removeDivisionIndex].divisions.splice(action.index, 1)
                }
            }

            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };


        ////save the competition fees details
        case ApiConstants.API_SAVE_COMPETITION_FEES_DETAILS_LOAD:
            return { ...state, onLoad: true, error: null };

        case ApiConstants.API_SAVE_COMPETITION_FEES_DETAILS_SUCCESS:
            let detailsSuccessData = action.result.data
            state.competitionId = detailsSuccessData.competitiondetail.competitionUniqueKey
            state.defaultCompFeesOrgLogoData = detailsSuccessData.competitiondetail.organisationLogo
            state.defaultCompFeesOrgLogo = detailsSuccessData.competitiondetail.organisationLogo ?
                detailsSuccessData.competitiondetail.organisationLogo.logoUrl : null
            return {
                ...state,
                onLoad: false,
                status: action.status,
                competitionDetailData: detailsSuccessData.competitiondetail,
                competitionMembershipProductData: detailsSuccessData.competitionmembershipproduct,
                error: null
            };

        ////Add-Edit competition fees details
        case ApiConstants.API_ADD_EDIT_COMPETITION_FEES_DETAILS:

            if (action.key == "venues") { /// add-edit venues
                state.selectedVenues = action.data
                let venuesForPost = createVenuesList(state.venueList, action.data, state.competitionDetailData.venues)
                state.postVenues = venuesForPost
            } else if (action.key == "nonPlayingObjectAdd") { /// add non playing dates
                state.competitionDetailData.nonPlayingDates.push(action.data)
            } else if (action.key == "invitees") { /// add-edit inviteess
                state.selectedInvitees = action.data
                state.postInvitees = createInviteesPostArray(action.data, state.competitionDetailData.invitees)
            }
            else if (action.key == "logoIsDefault") {
                state.competitionDetailData[action.key] = action.data
                if (action.data == true) {
                    state.competitionDetailData.competitionLogoUrl = state.defaultCompFeesOrgLogo
                }

            }
            else if (action.key == "nonPlayingDataRemove") {
                let nonPlayingIndex = action.data
                state.competitionDetailData.nonPlayingDates.splice(nonPlayingIndex, 1)
            }
            else {
                state.competitionDetailData[action.key] = action.data
            }
            return {
                ...state,
                error: null
            }


        //update charity round and update dicount govt voucher
        case ApiConstants.UPDATE_PAYMENTS_COMPETITION_FEES:
            if (action.key == 'charityRoundUp') {
                state.charityRoundUp[action.index].isSelected = action.value

            }

            if (action.key == "govermentVouchers") {
                state.govtVoucher[action.index].isSelected = action.value
                // state.selectedCharityArray.push(charityRoundUp[action.index])
            }
            let postCharityArray = checkCharityArray(state.charityRoundUp, state.defaultChairtyOption)
            let postGovtArray = checkVoucherArray(state.govtVoucher, state.defaultGovtVoucher)
            state.competitionPaymentsData.charityRoundUp = postCharityArray
            state.competitionDiscountsData.govermentVouchers = postGovtArray
            return { ...state }

        /// update payment option in competiton fee
        case ApiConstants.UPDATE_PAYMENTS_OPTIONS_COMPETITION_FEES:
            let getUpdatedCasualFeeArr = []
            let getUpdatedSeasonalFeeArr = []
            if (action.key == "casualfee") {
                state.selectedCasualFeeKey = action.value
                let updatedCasual = getUpdatedCasualFee(action.value, getUpdatedCasualFeeArr, state.defaultSelectedCasualFee, 1)
                state.selectedCasualFee = updatedCasual
            }
            else {
                state.SelectedSeasonalFeeKey = action.value
                let updatedSeasonal = getUpdatedCasualFee(action.value, getUpdatedSeasonalFeeArr, state.defaultSelectedSeasonalFee, 2)
                state.SelectedSeasonalFee = updatedSeasonal

            }
            return { ...state }



        // for post api of competition fee
        case ApiConstants.API_POST_COMPETITION_FEE_PAYMENT_LOAD:
            return { ...state, onLoad: true, error: null }
        case ApiConstants.API_POST_COMPETITION_FEE_PAYMENT_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                competitionMembershipProductData: action.result.data.competitionmembershipproduct,
                error: null
            }


        // for add and remove another discount competion fee
        case ApiConstants.ADD_ANOTHER_DISCOUNT_COMPETITION_FEE:
            if (action.keyAction == "add") {
                const newObj = {
                    "competitionMembershipProductTypeId": null,
                    "competitionTypeDiscountId": 0,
                    "membershipProductUniqueKey": null,
                    "competitionTypeDiscountTypeRefId": 1,
                    "amount": "",
                    "description": '',
                    "availableFrom": null,
                    "availableTo": null,
                    "discountTypeRefId": 2,
                    "discountCode": '',
                    "childDiscounts": [],
                    "question": '',
                    "applyDiscount": 0,
                    "membershipProductTypes": [],
                }
                state.competionDiscountValue.competitionDiscounts[0].discounts.push(newObj)
            }
            else if (action.keyAction == "remove") {
                state.competionDiscountValue.competitionDiscounts[0].discounts.splice(action.index, 1)
            }
            return {
                ...state,
                error: null
            };

        // update discount data  in  competition fee
        case ApiConstants.UPDATE_DISCOUNT_DATA_COMPETITION_FEES:
            state.competionDiscountValue.competitionDiscounts[0].discounts = action.discountData
            return {
                ...state,
                error: null
            }

        // update discount membership product
        case ApiConstants.UPDATE_DISCOUNT_MEMBERSHIP_PRODUCT:
            state.discountMembProductKey = action.value
            state.competionDiscountValue.competitionDiscounts[0].discounts = action.discountData
            let selectedProductype = getSelectedDiscountProduct(action.value, state.competitionMembershipProductData)
            state.competionDiscountValue.competitionDiscounts[0].discounts[action.index].membershipProductTypes = selectedProductype
            state.competionDiscountValue.competitionDiscounts[0].discounts[action.index].competitionMembershipProductTypeId = null
            return { ...state }


        // get default charity and govt voucher
        case ApiConstants.API_REG_COMPETITION_FEE_DEFAULT_CHARITY_SUCCESS:
            let charityData = getCharityResult(action.charityResult)
            let govtVocuherData = getCharityResult(action.govtVoucherResult)
            state.charityRoundUp = charityData
            state.govtVoucher = govtVocuherData
            return { ...state }

        // for post api competition fee discount api call
        case ApiConstants.API_POST_COMPETITION_FEE_DISCOUNT_LOAD:
            return { ...state, onLoad: true, }
        case ApiConstants.API_POST_COMPETITION_FEE_DISCOUNT_SUCCESS:

            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            }


        case ApiConstants.API_COMPETITION_DISCOUNT_TYPE_LOAD:
            return { ...state, onLoad: true }
        case ApiConstants.API_COMPETITION_DISCOUNT_TYPE_SUCCESS:
            return {
                ...state,
                onLoad: false,
                defaultDiscountType: action.result.id,
                error: null
            }

        case ApiConstants.CHECK_UNCHECK_COMPETITION_FEES_SECTION:

            state.competitionFeesData[action.parentIndex][action.key] = action.data

            return {
                ...state,
                error: null
            }



        case ApiConstants.API_ADD_EDIT_COMPETITION_FEES_SECTION:
            let array = state.competitionFeesData

            let index = array.findIndex(x => x.membershipProductUniqueKey == action.record.membershipProductUniqueKey)

            if (index > -1) {
                if (array[index].isAllType == "allDivisions") {
                    if (action.key == "fee") {
                        array[index][action.arrayKey].allType[action.tableIndex].fee = Number(action.data)
                        array[index][action.arrayKey].allType[action.tableIndex].gst = Number(action.data) / 10
                        array[index][action.arrayKey].allType[action.tableIndex].total = Number(action.data) + (Number(action.data / 10)) + (Number(action.record.mFees))
                    }
                    else if (action.key == "gst") {
                        let fee = array[index][action.arrayKey].allType[action.tableIndex].fee
                        array[index][action.arrayKey].allType[action.tableIndex].gst = Number(action.data)
                        array[index][action.arrayKey].allType[action.tableIndex].total = Number(fee) + (Number(action.data)) + (Number(action.record.mFees))
                    }
                    else if (action.key == "affiliateFee") {
                        let feesOwner = array[index][action.arrayKey].allType[action.tableIndex].fee + array[index][action.arrayKey].allType[action.tableIndex].gst
                        array[index][action.arrayKey].allType[action.tableIndex].affiliateFee = Number(action.data)
                        array[index][action.arrayKey].allType[action.tableIndex].affiliateGst = Number(action.data) / 10
                        array[index][action.arrayKey].allType[action.tableIndex].total = Number(feesOwner) + Number(action.data) + (Number(action.data / 10)) + (Number(action.record.mFees))
                    }
                    else if (action.key == "affiliateGst") {
                        let feesOwner = array[index][action.arrayKey].allType[action.tableIndex].fee + array[index][action.arrayKey].allType[action.tableIndex].gst
                        let feeAffiliate = array[index][action.arrayKey].allType[action.tableIndex].affiliateFee
                        array[index][action.arrayKey].allType[action.tableIndex].affiliateGst = Number(action.data)
                        array[index][action.arrayKey].allType[action.tableIndex].total = Number(feesOwner) + Number(feeAffiliate) + (Number(action.data)) + (Number(action.record.mFees))
                    }


                } else {

                    if (action.key == "fee") {
                        array[index][action.arrayKey].perType[action.tableIndex].fee = Number(action.data)
                        array[index][action.arrayKey].perType[action.tableIndex].gst = Number(action.data) / 10
                        array[index][action.arrayKey].perType[action.tableIndex].total = Number(action.data) + (Number(action.data / 10)) + (Number(action.record.mFees))
                    }
                    else if (action.key == "gst") {
                        let fee = array[index][action.arrayKey].perType[action.tableIndex].fee
                        array[index][action.arrayKey].perType[action.tableIndex].gst = Number(action.data)
                        array[index][action.arrayKey].perType[action.tableIndex].total = Number(fee) + (Number(action.data)) + (Number(action.record.mFees))
                    }
                    else if (action.key == "affiliateFee") {
                        let feesOwner = array[index][action.arrayKey].perType[action.tableIndex].fee + array[index][action.arrayKey].perType[action.tableIndex].gst
                        array[index][action.arrayKey].perType[action.tableIndex].affiliateFee = Number(action.data)
                        array[index][action.arrayKey].perType[action.tableIndex].affiliateGst = Number(action.data) / 10
                        array[index][action.arrayKey].perType[action.tableIndex].total = Number(feesOwner) + Number(action.data) + (Number(action.data / 10)) + (Number(action.record.mFees))
                    }
                    else if (action.key == "affiliateGst") {
                        let feesOwner = array[index][action.arrayKey].perType[action.tableIndex].fee + array[index][action.arrayKey].perType[action.tableIndex].gst
                        let feeAffiliate = array[index][action.arrayKey].perType[action.tableIndex].affiliateFee
                        array[index][action.arrayKey].perType[action.tableIndex].affiliateGst = Number(action.data)
                        array[index][action.arrayKey].perType[action.tableIndex].total = Number(feesOwner) + Number(feeAffiliate) + (Number(action.data)) + (Number(action.record.mFees))
                    }
                }
                state.competitionFeesData = array
            }

            return {
                ...state
            }

        case ApiConstants.API_COMPETITION_FEE_DEFAULT_CHARITY_LOAD:
            return { ...state, onLoad: true, error: null }

        //get charity and govt voucher  from init api
        case ApiConstants.API_COMPETITION_FEE_DEFAULT_CHARITY_SUCCESS:
            let charityDataArr = getCharityResult(action.charityResult)
            let govtVocuherDataArr = getCharityResult(action.govtVoucherResult)
            state.charityRoundUp = charityDataArr
            state.govtVoucher = govtVocuherDataArr
            return {
                ...state,
                charityRoundUp: charityDataArr,
                govtVoucher: govtVocuherDataArr,
                onLoad: false,
                error: null
            }


        case ApiConstants.API_SAVE_COMPETITION_FEES_SECTION_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.API_SAVE_COMPETITION_FEES_SECTION_SUCCESS:
            return {
                ...state,
                onLoad: false,
                status: action.status,
                error: null
            };


        ///clearing particular reducer data
        case ApiConstants.REG_COMPETITION_FEES_CLEARING_REDUCER_DATA:
            if (action.dataName == "all") {
                const defaultDetailObj = {
                    competitionUniqueKey: "",
                    competitionName: "",
                    description: "",
                    competitionTypeRefId: 1,
                    competitionFormatRefId: 1,
                    startDate: null,
                    noOfRounds: "",
                    roundInDays: "",
                    roundInHours: "",
                    roundInMins: "",
                    registrationCloseDate: null,
                    competitionLogoUrl: null,
                    minimunPlayers: "",
                    maximumPlayers: "",
                    venues: [],
                    nonPlayingDates: [],
                    invitees: [],
                    selectedVenuesIds: [],
                    logoIsDefault: false,
                    yearRefId: 1
                }
                state.competitionDetailData = defaultDetailObj
                state.competitionId = ""
                state.postVenues = []
                state.postInvitees = []
                state.selectedVenues = []
                state.selectedInvitees = []
                state.competitionDivisionsData = null
                state.competitionFeesData = []
                state.selectedCasualFee = []
                state.SelectedSeasonalFee = []
                state.SelectedSeasonalFeeKey = []
                state.selectedCasualFeeKey = []

                // state.charityRoundUp = []
                // state.govtVoucher = []
                state.competionDiscountValue.competitionDiscounts[0].discounts = []
            }
            return {
                ...state, error: null
            };


        //////get the default competition logo api
        case ApiConstants.API_COMPETITION_FEE_DEFAULT_LOGO_LOAD:
            return { ...state, onLoad: true, error: null }


        case ApiConstants.API_COMPETITION_FEE_DEFAULT_LOGO_SUCCESS:
            console.log("action.result.data", action.result.data)
            return {
                ...state,
                onLoad: false,
                error: null,
                defaultCompFeesOrgLogoData: action.result.data,
                defaultCompFeesOrgLogo: action.result.data.logoUrl
            }

        case ApiConstants.API_ADD_VENUE_SUCCESS:
            let venueSuccess = action.result
            let updatedVenue = JSON.parse(JSON.stringify(state.newVenueObj))
            updatedVenue["id"] = venueSuccess.venueId
            updatedVenue['name'] = venueSuccess.name
            updatedVenue['street1'] = venueSuccess.street1
            updatedVenue['street2'] = venueSuccess.street2
            updatedVenue['suburb'] = venueSuccess.suburb
            updatedVenue['postalCode'] = venueSuccess.postalCode
            updatedVenue['stateRefId'] = venueSuccess.stateRefId
            updatedVenue['statusRefId'] = venueSuccess.statusRefId
            updatedVenue['contactNumber'] = venueSuccess.contactNumber
            state.venueList.push(updatedVenue)
            return { ...state }


        default:
            return state;
    }
}

export default competitionFees;
