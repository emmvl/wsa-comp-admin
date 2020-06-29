const ValidationConstants = {
    nameField: ["Name is required.", "Last name is required.", "Name is required.", "Short name is required"],
    teamName: "Team name is required.",
    firstName: 'Name is required.',
    dateField: 'Date is required.',
    divisionField: 'Division field is required.',
    typeField: 'Type is required.',
    homeField: 'Home team is required.',
    awayField: 'Away team is required.',
    venueField: 'Venue is required.',
    roundField: 'Round is required.',
    durationField: 'Duration time is required.',
    emailField: ['Email is required.', 'Pleae enter valid email.', 'After changing your email address, you will need to relogin with your new email address'],
    contactField: 'Contact is required.',
    competitionField: 'Competition is required.',
    timerField: 'Timer is required.',
    newsValidation: ['News title is required.', 'Author is required'],
    bannerImage: 'Banner image is required',
    selectYear: 'Year is required.',
    registrationDateField: ['Registration close date is required.'],
    addressField: ["Address is required."],
    searchManager: "Manager search is required.",
    searchScorer: "Scorer search is required.",
    affiliateField: "Affiliate is required",
    rolesField: ["Roles field is mandatory"],
    genderField: "Gender is required",
    dateOfBirth: "DOB is required",
    membershipProductRequired: "Please select the competition membership product",
    emergencyContactNumber: ["Emergency contact number is required"],
    emergencyContactName: ["Emergency contact name is required"],
    existingMedicalCondition: ["Existing Medical Conditions is required"],
    regularMedication: ["Regular Medications is required"],
    heardBy: ["HeardBy is required"],
    favoriteTeamField: ["Favorite Team is required"],
    firebirdField: ["Firebird is required"],
    termsAndCondition: ["Terms and Condition is required"],
    affiliateContactRequired: ["Affiliate should have atleast one contact with admin role"],
    requiredMessage: ["Please fill all the required fields"],
    drawsMessage: ["Something went wrong with draws generation"],
    finalGrading: ["Please provide final grade for all the teams"],
    proposedGrading: ["Please provide proposed grade for all the teams"],

    /////////////membership 
    membershipProductIsRequired: "Membership product name is required.",
    pleaseSelectValidity: "Please select validity.",
    pleaseSelectYear: "Please select Year.",
    pleaseSelectDOBFrom: "Please select DOB From.",
    PleaseSelectDOBTo: "Please select DOB To.",
    pleaseSelectMembershipTypes: "Please select membership types.",
    competitionLogoIsRequired: "Competition logo is required.",
    disclaimersIsRequired: "Disclaimers is required.",
    DisclaimerLinkIsRequired: "Disclaimer link is required.",
    pleaseSelectMembershipProduct: "Please select membership product.",
    userPhotoIsRequired: "User photo is required.",



    /////Venuew and times
    suburbField: ["Suburb is required."],
    stateField: ['State field is required.'],
    dayField: ['Day field is required.'],
    courtField: ["Court number field is required.", "Longitude field is required.",
        "Latitude field is required.", "Court field is required.",
        "Division field is required.", "Grade field is required.", "Start time is required",
        "End time is required"],
    postCodeField: ["Postcode is required"],

    //////comp fees
    competitionNameIsRequired: "Competition name is required.",
    pleaseSelectCompetitionType: "Please select competition type.",
    pleaseSelectCompetitionFormat: "Please select competition format.",
    numberOfRoundsNameIsRequired: 'Number of rounds Name is required.',
    registrationOpenDateIsRequired: "Registration open date is required.",
    registrationCloseDateIsRequired: 'Registration close date is required.',

    //time slot 
    timeSlotPreference: "At least one timeslot must be entered",
    timeSlotVenue: "Please select venueId",
    gradeField: 'Grade field is required.',


    ///401 message
    messageStatus401: "The user is not authorized to make the request.",

    //venue court
    emptyAddCourtValidation: "Please add court to add venue.",
    emptyGameDaysValidation: "Please add game days to venue",


    //Add/edit Division
    divisionNameisrequired: "Division name is required.",
    gradeisrequired: "Grade is required.",


    selectMinuteHourSecond: "Please select one of the field Hours/Minutes/seconds",
    pleaseSelectvenue: "Please select venue.",

    timeField: "Time is required.",
    pleaseSelect: "Please select any option.",
    court: "Court is required.",


    csvField: "Please select CSV file.",
    compRegHaveBeenSent: "Competition Registrations have been sent already.",
    feesCannotBeEmpty: "Please select fees.",

    shortField: "Short name is required.",
    pleaseSelectRegInvitees: "Please select Registration Invitee.",
    compIsPublished: "Competition is Published.",


    specificTime: "Please select Specific Time.",

    selectReason: 'Reason is required.',
    pleaseSelectCompetition: "Please select competition",
    matchDuration: "Please enter a match duration",
    mainBreak: "Please enter a main break",
    qtrBreak: "Please enter a qtr break",
    timeBetweenGames: "Please enter a time between games",
    startDateIsRequired: 'Start date is required.',
    endDateIsRequired: 'End date is required',

    divisionName: "Division Name field is required.",
    genderRestriction: "Please select gender.",
    matchTypeRequired: "Please select match type",
    organisationPhotoRequired: 'Organisation photo is required',
    photoTypeRequired: "Photo type is required",
    pleaseSelectVenue: "Please select Venue",
    pleaseSelectRound: "Please select round",
    homeTeamRotationRequired: "Home team rotation is required",
    courtRotationRequired: "Court rotation is required",
    finalsStartDateRequired: "Finals start date is required",
    extraTimeMatchTypeRequired: "Please select extra time type",
    extraTimeDurationRequired: "Please enter extra time duration",
    extraTimeMainBreakRequired: "Please enter extra time main break",
    extraTimeBreakRequired: "Please enter extra time break",
    beforeExtraTimeRequired: "Please enter before extra time",
    finalFixtureTemplateRequired: "Please select final fixture template",
    extraTimeDrawRequired: "Please select extra time draw",
    applyToRequired: "Please select apply to",
    gradeNameRequired: "Grade name is required",
    startTime: "Start time is required",

    pleaseSelectDiscountType: "Please select discount type.",
    affiliateToRequired: "Please select affiliate to",
    playerMessage: "This player has not been linked to a user profile",
    gameDayEndTimeValidation: "Game day end time should be greater than start time",
    venueCourtEndTimeValidation: "Venue court end time should be greater than start time",
    charityTitleNameIsRequired: "Charity title is required.",

    coachSearch: "Coach Search",
    searchCoach: "Please search coach.",
    charityDescriptionIsRequired: "Charity description is required.",
    pleaseAddDivisionForMembershipProduct: "Please enter divisions before proceeding.",
    pleaseEnterChildDiscountPercentage: "Please enter child discount.",
    pleaseSelectTeam: 'Please Select Team.',
    selectAbandonMatchReason: 'Please Select Reason.',
    umpireSearch: "Umpire search is required.",
    umpireMessage: "This umpire has not been linked to a user profile",

    ///shop
    enterTitleOfTheProduct: 'Please enter title of the product.',
    enterLengthOfTheProduct: 'Please enter length of the product.',
    enterWidthOfTheProduct: 'Please enter width of the product.',
    enterHeightOfTheProduct: 'Please enter height of the product.',
    enterWeightOfTheProduct: 'Please enter weight of the product.',
    pleaseEnterProductType: "Please enter product type.",
    pleaseEnterVariantName: "Please enter variant name.",

    SelectNumberTeam: "Please add number of Teams",
    email_validation: "Please enter valid email address!",
    matchDeleteMsg: 'This match cannot be deleted as it has already ended.',
    userNotFound: "Please select an existing user for this competition."
};

export default ValidationConstants;
