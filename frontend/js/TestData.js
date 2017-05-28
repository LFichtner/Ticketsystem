var testDataUsers = [
    {
        userID: createUUID(),
        userName: 'lasse',
        userPassword: 'pwd4lasse',
        userFirstName: 'lasse',
        userLastName: 'fichtner',
        userPermission: true,
        userMail: 'lassefichtner@gmx.de'
    },
    {
        userID: createUUID(),
        userName: 'richard',
        userPassword: '1234',
        userFirstName: 'richard',
        userLastName: 'friedrich',
        userPermission: false,
        userMail: 'richardF@gmail.com'
    },
    {
        userID: createUUID(),
        userName: 'edgar',
        userPassword: '1234',
        userFirstName: 'edagar',
        userLastName: 'von Stift',
        userPermission: false,
        userMail: 'vedgar@gmx.de'
    }
];

var testDataProjekts = [
    {
        projektID: createUUID(),
        projektName: 'Aufgabenverwaltung'
    },
    {
        projektID: createUUID(),
        projektName: 'MYKENE'
    }
];

var testDataTickets = [
    {
        ticketID: createUUID(),
        ticketTitle: 'Web',
        ticketDescription: 'create a Website',
        ticketType: 'Task',
        ticketPriority: 2,
        ticketDueDate: '29.08.2016',
        ticketProjektID: testDataProjekts[0].projektID,
        ticketUserID: testDataUsers[1].userID,
        ticketCreatedBy: testDataUsers[0].userID,
        ticketCreationDate: '14.06.2016',
        ticketInProgress: true
    },
    {
        ticketID: createUUID(),
        ticketTitle: 'Fix Web',
        ticketDescription: 'fix the Website',
        ticketType: 'Bug',
        ticketPriority: 2,
        ticketDueDate: '29.11.2016',
        ticketProjektID: testDataProjekts[0].projektID,
        ticketUserID: testDataUsers[1].userID,
        ticketCreatedBy: testDataUsers[0].userID,
        ticketCreationDate: '14.06.2016',
        ticketInProgress: false
    },
    {
        ticketID: createUUID(),
        ticketTitle: 'It´s not a Bug it´s a Feature',
        ticketDescription: 'Don´t have to fix it just sell it!',
        ticketType: 'Feature',
        ticketPriority: 3,
        ticketDueDate: '02.08.2016',
        ticketProjektID: testDataProjekts[1].projektID,
        ticketUserID: testDataUsers[0].userID,
        ticketCreatedBy: testDataUsers[1].userID,
        ticketCreationDate: '14.06.2016',
        ticketInProgress: false
    }
];

var testDataFilters = [
    {
        filterID: createUUID(),
        filterFieldName: 'ticketType',
        filterFunction: 'include',
        filterValue: 'Bug'
    },
    {
        filterID: createUUID(),
        filterFieldName: 'ticketType',
        filterFunction: 'exclude',
        filterValue: 'Bug'
    },
    {
        filterID: createUUID(),
        filterFieldName: 'ticketUser',
        filterFunction: 'include',
        filterValue: 'ME'
    }
];