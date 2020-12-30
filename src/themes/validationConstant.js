const ValidationConstants = {
    nameField: ['Name is required.', 'Last name is required.', 'Name is required.', 'Short name is required'],
    teamName: 'Team name is required.',
    firstName: 'Name is required.',
    dateField: 'Date is required.',
    divisionField: 'Division field is required.',
    typeField: 'Type is required.',
    homeField: 'Home team is required.',
    awayField: 'Away team is required.',
    venueField: 'Venue is required.',
    roundField: 'Round is required.',
    durationField: 'Duration time is required.',
    emailField: [
        'Email is required.',
        'Please enter valid email.',
        'After changing your email address, you will need to relogin with your new email address',
    ],
    contactField: 'Contact is required.',
    competitionField: 'Competition is required.',
    timerField: 'Timer is required.',
    newsValidation: ['News title is required.', 'Author is required'],
    bannerImage: 'Banner image is required',
    horizontalBannerImage: 'Horizontal Banner image is required',
    squareBannerImage: 'Square Banner image is required',
    moreBannerImage: 'At least one of Banner images is required',
    selectYear: 'Year is required.',
    registrationDateField: ['Registration close date is required.'],
    addressField: ['Address is required.'],
    searchManager: 'Manager search is required.',
    searchScorer: 'Scorer search is required.',
    affiliateField: 'Affiliate is required',
    rolesField: ['Roles field is mandatory'],
    genderField: 'Gender is required',
    dateOfBirth: 'DOB is required',
    membershipProductRequired: 'Please select the competition membership product',
    emergencyContactNumber: ['Emergency contact number is required'],
    emergencyContactName: ['Emergency contact first name is required','Emergency contact last name is required'],
    existingMedicalCondition: ['Existing Medical Conditions is required'],
    regularMedication: ['Regular Medications is required'],
    heardBy: ['HeardBy is required'],
    favoriteTeamField: ['Favorite Team is required'],
    firebirdField: ['Firebird is required'],
    termsAndCondition: ['Terms and Condition is required'],
    affiliateContactRequired: ['Affiliate should have atleast one contact with admin role'],
    requiredMessage: ['Please fill all the required fields'],
    drawsMessage: ['Something went wrong with draws generation'],
    finalGrading: ['Please provide final grade for all the teams'],
    proposedGrading: ['Please provide proposed grade for all the teams'],

    // membership
    membershipProductIsRequired: 'Membership product name is required.',
    pleaseSelectValidity: 'Please select validity.',
    pleaseSelectYear: 'Please select Year.',
    pleaseSelectDOBFrom: 'Please select DOB From.',
    PleaseSelectDOBTo: 'Please select DOB To.',
    pleaseSelectMembershipTypes: 'Please select membership types.',
    competitionLogoIsRequired: 'Competition logo is required.',
    disclaimersIsRequired: 'Disclaimers is required.',
    DisclaimerLinkIsRequired: 'Disclaimer link is required.',
    pleaseSelectMembershipProduct: 'Please select membership product.',
    userPhotoIsRequired: 'User photo is required.',

    // Venue and times
    suburbField: ['Suburb is required.'],
    stateField: ['State field is required.'],
    dayField: ['Day field is required.'],
    courtField: [
        'Court number field is required.', 'Court field is required.',
        'Longitude field is required.', 'Latitude field is required.',
        'Division field is required.', 'Grade field is required.',
        'Start time is required', 'End time is required',
    ],
    postCodeField: ['Postcode is required'],

    // comp fees
    competitionNameIsRequired: 'Competition name is required.',
    pleaseSelectCompetitionType: 'Please select competition type.',
    pleaseSelectCompetitionFormat: 'Please select competition format.',
    numberOfRoundsNameIsRequired: 'Number of rounds Name is required.',
    registrationOpenDateIsRequired: 'Registration open date is required.',
    registrationCloseDateIsRequired: 'Registration close date is required.',

    // time slot
    timeSlotPreference: 'At least one timeslot must be entered',
    timeSlotVenue: 'Please select venueId',
    gradeField: 'Grade field is required.',

    /// 401 message
    messageStatus401: 'The user is not authorized to make the request.',

    // venue court
    emptyAddCourtValidation: 'Please add court to add venue.',
    emptyGameDaysValidation: 'Please add game days to venue',

    // Add/edit Division
    divisionNameIsRequired: 'Division name is required.',
    gradeIsRequired: 'Grade is required.',

    selectMinuteHourSecond: 'Please select one of the field Hours/Minutes/seconds',

    timeField: 'Time is required.',
    pleaseSelect: 'Please select any option.',
    court: 'Court is required.',

    csvField: 'Please select CSV file.',
    compRegHaveBeenSent: 'Competition Registrations have been sent already.',
    feesCannotBeEmpty: 'Please select fees.',

    shortField: 'Short name is required.',
    pleaseSelectRegInvitees: 'Please select Registration Invitee.',
    compIsPublished: 'Competition is Published.',

    specificTime: 'Please select Specific Time.',

    selectReason: 'Reason is required.',
    pleaseSelectCompetition: 'Please select competition',
    matchDuration: 'Please enter a match duration',
    mainBreak: 'Please enter a main break',
    qtrBreak: 'Please enter a qtr break',
    timeBetweenGames: 'Please enter a time between games',
    startDateIsRequired: 'Start date is required.',
    endDateIsRequired: 'End date is required',

    divisionName: 'Division Name field is required.',
    genderRestriction: 'Please select gender.',
    matchTypeRequired: 'Please select match type',
    organisationPhotoRequired: 'Organisation photo is required',
    photoTypeRequired: 'Photo type is required',
    pleaseSelectVenue: 'Please select Venue',
    pleaseSelectRound: 'Please select round',
    homeTeamRotationRequired: 'Home team rotation is required',
    courtRotationRequired: 'Court rotation is required',
    finalsStartDateRequired: 'Finals start date is required',
    extraTimeMatchTypeRequired: 'Please select extra time type',
    extraTimeDurationRequired: 'Please enter extra time duration',
    extraTimeMainBreakRequired: 'Please enter extra time main break',
    extraTimeBreakRequired: 'Please enter extra time break',
    beforeExtraTimeRequired: 'Please enter before extra time',
    finalFixtureTemplateRequired: 'Please select final fixture template',
    extraTimeDrawRequired: 'Please select extra time draw',
    applyToRequired: 'Please select apply to',
    gradeNameRequired: 'Grade name is required',
    startTime: 'Start time is required',

    pleaseSelectDiscountType: 'Please select discount type.',
    affiliateToRequired: 'Please select affiliate to',
    playerMessage: 'This player has not been linked to a user profile',
    gameDayEndTimeValidation: 'Game day end time should be greater than start time',
    venueCourtEndTimeValidation: 'Venue court end time should be greater than start time',
    charityTitleNameIsRequired: 'Charity title is required.',

    coachSearch: 'Coach Search',
    searchCoach: 'Please search coach.',
    charityDescriptionIsRequired: 'Charity description is required.',
    pleaseAddDivisionForMembershipProduct: 'Please enter divisions before proceeding.',
    pleaseEnterChildDiscountPercentage: 'Please enter child discount.',
    pleaseSelectTeam: 'Please Select Team.',
    selectAbandonMatchReason: 'Please Select Reason.',
    umpireSearch: 'Umpire search is required.',
    umpireMessage: 'This umpire has not been linked to a user profile',

    // shop
    enterTitleOfTheProduct: 'Please enter title of the product.',
    enterLengthOfTheProduct: 'Please enter length of the product.',
    enterWidthOfTheProduct: 'Please enter width of the product.',
    enterHeightOfTheProduct: 'Please enter height of the product.',
    enterWeightOfTheProduct: 'Please enter weight of the product.',
    pleaseEnterProductType: 'Please enter product type.',
    pleaseEnterVariantName: 'Please enter variant name.',

    SelectNumberTeam: 'Please add number of Teams',
    email_validation: 'Please enter valid email address!',
    matchDeleteMsg: 'This match cannot be deleted as it has already ended.',
    userNotFound: 'No matching user was found.',

    incidentName: 'Incident name is required.',
    divisionAndTimeslot: 'Please select Division and Timeslot',
    pleaseSelectAffiliate: 'Please select one affiliate.',
    incidentPlayer: 'Player name is required',
    point: 'Point is required.',
    reasonChange: 'Reason is required.',
    userName: 'User name is required.',
    userRegister: 'User register is required',
    competitionAdministrator: 'Competition administrator is required',
    regChangeDate: 'Registration change date is required',
    compStartDate: 'Competition start date is required',
    pleaseEnterQuantity: 'Please enter quantity.',
    recordUmpireField: 'Record umpire is required.',
    attendanceRecordField: 'Record is required.',
    attendanceReportField: 'Report is required.',
    scoringField: 'Scoring is required.',
    enterAddress: 'Please enter address.',
    enterSuburb: 'Please enter suburb.',
    enterState: 'Please enter state.',
    enterPostcode: 'Please enter postcode.',
    passwordVerification: 'Password must be minimum 8 characters',

    // Venue Add/Edit
    venueAddressRequiredError: 'Venue address is required',
    venueAddressDetailsError: 'Please select a venue which has a street address',
    duplicatedVenueAddressError: 'Venue address is duplicated, please select other address',
    duplicateDiscountError: 'Please remove the duplicate entry of Discount Code.',
    mnbMatchId: 'mnbMatchId is required',
    pleaseSelectOneOption: 'Please select any option.',
    pleaseProvideInstalmentDate: 'Please provide an instalment date',
    duplicateFamilyDiscountError: 'Only one Family Discount Code for your organisation is permitted. Please remove the duplicate entry.',
    membershipDuplicateFamilyDiscountError: 'Only one Family Discount Code for Membership Fee is permitted. Please remove the duplicate entry.',
    mobileLength: 'Contact number must be 10 digits',
    pleaseFillRegistration: 'Please fill the Registration Code',
    extraTimeType: 'Please select extra time type',
    positionTrackingIsRequired: 'Position tracking is required',
    RecordGoalAttemptsIsRequired: 'Record goal attempts is required',
    pleaseSelectBetweenUmpireAndCoach: 'User must be umpire, umpire coach or both',
    pleaseSelectOrg: 'Please select organisation',
    refundAmtRequired: 'Please enter the partial amount',
    refundAmtCheck: 'Refund amount cannot be greater that actual amount.',
    declineReasonRequired: 'Please select the reason to decline',
    deRegisterReasonRequired: 'Please select the reason to De-register',
    transferReasonRequired: 'Please select the reason to Transfer',
    deRegisterChangeTypeRequired: 'Please select the De-register change type',
    organisationField: 'Organisation is required',
    pleaseSelectGradesOrPools: 'Please select Grades or Pools',
    playOff3rdPositionRequired: 'Playoff 3rd position required',
    wpwPool1Required: 'WPW pool1 is required',
    wpwPool2Required: 'WPW pool2 is required',
    wpwPool3Required: 'WPW pool3 is required',
    wpwPool4Required: 'WPW pool4 is required',
    heroImageIsRequired: 'Hero image is required',
    newYearFieldIsRequired: 'New year field is required',
    competitionStartEndDateIsRequired: 'Competition Start and End date is required',
    playerTypeRequired: 'Please select the player type',
    pleaseSelectPaymentMethods: 'Please select payment methods',
    newMembershipDuplicateError: 'Membership product is not same as another product you have selected',
    yearIsRequired: 'Year is required',
    membershipProductIsRequired1: 'Membership Product is required',

    // Affiliate Add/Edit
    affiliateAddressRequiredError: 'Please input affiliate address in details',
    affiliateAddressDetailError: 'Please select a affiliate address which has a street address',

    daysRequired: "Days is required",
    extendEndDateRequired: "Extend end date is required",
    pleaseFillDivisionBeforePublishing: "Please fill division before publishing.",
    pleaseFillFeesBeforePublishing: "Please fill fees before publishing.",

    membershipProductsRequired: "Membership products is required",
    membershipFeeRequired: "Membership Fee is required",
    fromDateIsRequired: "From date is required",
    toDateIsRequired: "To date is required",
    membershipIsPublished: "Membership is published",
    paymentMandatory: 'A payment method needs to be chosen to Publish Competition Fees',
    plzReviewPage: 'Please review this page and correct any errors before submitting again',
    nameisrequired: 'Name is required.',
    suburbRequired: 'Subrub is required.',
    stateRequired: 'State is required.',
    postcodeRequired: 'Postcode is required.',
};

export default ValidationConstants;
