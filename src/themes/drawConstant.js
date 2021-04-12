const DrawConstant = {
    emptySlot:{
        colorCode: "#999999",   
        awayTeamId: null,
        awayTeamName: null,                
        competitionDivisionGradeId: null,
        divisionName: null,
        drawsId: null,             
        gradeName: null,
        homeTeamId: null,
        homeTeamName: null,
        isLocked: 0,  
        venueId: undefined,
        teamArray:[
            {
                teamName: null,
                teamId: null,
            },
            {
                teamName: null,
                teamId: null,
            },
        ],
    },
    emptySlotFieldUpdate:{
        endTime: "",
        matchDate: "",
        startTime: "",
        venueCourtId: 0,
        venueCourtName: "",
        venueCourtNumber: 0,
        venueShortName: "",
        venueId:"",
        minuteDuration:0,
    },
    emptySlotVenueFieldUpdate:{                             
        venueCourtId: 0,
        venueCourtName: "",
        venueCourtNumber: 0,
        venueShortName: "",
        venueId:""
    },
    switchDrawNameFields:{
        awayTeamName:"",
        awayTeamOrganisationId:"",
        homeTeamName:"",
        divisionName:"",
        gradeName:"",
        colorCode:"",
        duplicate:false,
        homeTeamOrganisationId:"",
        isPastMatchAvailable:0,
        outOfCompetitionDate:0,
        outOfRoundDate:0,
        teamArray:[],
        slotId:""
        //subCourt:"" 
    },
    switchDrawTimeFields:{
        venueCourtId:0,
        matchDate:"",
        startTime:"",
        endTime:"",     
        venueCourtName:"",
        venueCourtNumber:0,
        venueShortName:"",
        venueId:""
    },
    subCourtHeightUnit:{
        "A": 4,"B":4,"C":2,"D":2,"E":2,"F":2,"G":1,"H":1,"I":1,"J":1,"K":1,"L":1,"M":1,"N":1,
    },
    //"O":3,"P":3,"Q":2  conflit with CDEF
    courtHalvesSubDivisionIds:["A","B"],
    courtQuartersSubDivisionIds:["C","D","E","F"],
    courtEighthsSubDivisionIds:["G","H","I","J","K","L","M","N"],
    courtThirdsSubDivisionIds:["O","P","Q"],
    courtAllSubDivisionIds:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q"]    
};

export default DrawConstant;
