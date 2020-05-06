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
    courtField: ["Court number field is required.", "Longitude field is required.", "Latitude field is required.", "Court field is required.", "Division field is required.", "Grade field is required."],
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
    homeTeamRotationRequired: "Home Team Rotation is required",
    courtRotationRequired: "Court Rotation is required"

};

export default ValidationConstants;
