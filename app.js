const PORT = 4200
const express = require('express')
const cors = require('cors')
const mssql = require('mssql')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const md5 = require('md5');
const app = express()
const config = {
    user: 'integreatadba',
    password: 'zJws5b4#QgvF374eo5',
    database: 'integreata',
    server: 'thailandbimuser.com',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}


app.use(cors())

app.get('/api', async function (req, res, next) {

    res.json({
        port: ['/login',
            '/material-chart',
            '/material-form',
            '/drawing-report',
            '/drawing-chart',
            '/manpower-chart',
            '/manpower-form',
            '/daily-report',
            '/daily-form'],
        get: ['/material-category',
            '/drawing-discipline']
    });

});
// app.get('/test', async function (req, res, next) {
//     mssql.connect(config, function (err) {
//         if (err) {
//             console.log(err.message);
//             return;
//         }
//         console.log('connection complete');
//         let request = new mssql.Request();
//         let query = 'select * from Members';
//         request.query(query, function (err, result) {
//             if (err) {
//                 console.log(err.message);
//                 return;
//             }
//             else {
//                 console.log(result['recordset']);
//                 res.json(result['recordset']);
//             }
//         });
//     });
// });

//
app.post('/login', jsonParser, function (req, res, next) {
    const username = req.body.username || '';
    const password = req.body.password || '';

    mssql.connect(config, function (err) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.log('connection complete');
        const hashPassword = md5(password);
        let request = new mssql.Request();
        //  'Select * from v_Project_in_Member WHERE IntMemberId=@IntMemberId'
        let query = 'select * from v_Members where username=\'' + username + '\' and password=\'' + hashPassword + '\'';
        //let 

        let dataReturn = {};
        request.query(query, function (err, result) {
            if (err) {
                console.log(err.message);
                return;
            }
            else {
                console.log(result['recordset']);
                dataReturn.canLogin = result['recordset'].length === 1;
                if (result['recordset'].length === 1) {
                    query = 'select * from v_Project_in_Member where username=\'' + username + '\' and password=\'' + hashPassword + '\'';
                    request.query(query, function (err, result) {
                        if (err) {
                            console.log(err.message);
                            return;
                        }
                        else {
                            dataReturn.project = result['recordset'];
                            console.log(result['recordset']);

                            // example data
                            //     { "IntMemberId": 3,
                            //     "MemberGuId": "34E4B56C-FEFD-47A0-95BB-5D9882B66326",
                            //     "IntRoleId": 2, "IntCompanyId": 1,
                            //     "IntPositionId": 4,
                            //     "Username": "eknarin.120643@gmail.com",
                            //     "Password": "81dc9bdb52d04dc20036dbd8313ed055",
                            //     "FirstName": "nut",
                            //     "LastName": null,
                            //     "MemberPic": null,
                            //     "Email": null,
                            //     "DtCreateDate": "2022-07-16T00:28:50.120Z",
                            //     "DtLastUpdate": "2022-07-21T21:49:39.077Z",
                            //     "BitEnable": true,
                            //     "RoleName": "Operator",
                            //     "PositionName": "Foreman",
                            //     "CompanyName": "Thailand Bim User Co., Ltd."
                            // }
                            res.json(dataReturn);
                        }
                    });

                } else {
                    dataReturn.error = 'can not Login';
                    res.json(dataReturn);
                }


            }
        });
    });
});

app.get('/material-category', async function (req, res, next) {
    mssql.connect(config, function (err) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.log('connection complete');
        let request = new mssql.Request();
        let query = 'select * from Material_Category';
        request.query(query, function (err, result) {
            if (err) {
                console.log(err.message);
                return;
            }
            else {

                let data = result['recordsets'][0].map((value, index) => {
                    return { 'IntCatId': value['IntCatId'], 'CategoryName': value['CategoryName'] }

                });
                res.json(data);
            }
        });
    });
})

app.post('/material-chart', jsonParser, function (req, res, next) {
    const projectId = req.body.projectId;
    const disciplineId = req.body.disciplineId;
    mssql.connect(config, function (err) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.log('connection complete');
        let request = new mssql.Request();
        let query = 'select * from Drawing where IntProjectId=' + projectId + 'and IntDecilpineId=' + disciplineId;
        let data = [];
        request.query(query, function (err, result) {
            if (err) {
                console.log(err.message);
                return;
            }
            else {
                // data['table'] = result['recordsets'][0].map((value, index) => {
                //     return { 'IntCatId': value['IntCatId'], 'CategoryName': value['CategoryName'] }
                // });
                data = [
                    {
                        "drawingNo": "1234",
                        "description": "test1",
                        "revision": "revision",
                        "status": "status",
                        "appDate": "Date1234"
                    },
                    {
                        "drawingNo": "1234",
                        "description": "test1",
                        "revision": "revision",
                        "status": "status",
                        "appDate": "Date1234"
                    }
                ]
            }
        });
        res.json(data);
    });
});

app.post('/material-form', jsonParser, function (req, res, next) {
    const projectId = req.body.projectId;
    const disciplineId = req.body.disciplineId;
    mssql.connect(config, function (err) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.log('connection complete');
        let request = new mssql.Request();
        let query = 'select * from Drawing where IntProjectId=' + projectId + 'and IntDecilpineId=' + disciplineId;
        let data = [];
        request.query(query, function (err, result) {
            if (err) {
                console.log(err.message);
                return;
            }
            else {
                // data['table'] = result['recordsets'][0].map((value, index) => {
                //     return { 'IntCatId': value['IntCatId'], 'CategoryName': value['CategoryName'] }
                // });
                data = [
                    {
                        "drawingNo": "1234",
                        "description": "test1",
                        "revision": "revision",
                        "status": "status",
                        "appDate": "Date1234"
                    },
                    {
                        "drawingNo": "1234",
                        "description": "test1",
                        "revision": "revision",
                        "status": "status",
                        "appDate": "Date1234"
                    }
                ]
            }
        });
        res.json(data);
    });
});

app.get('/drawing-discipline', async function (req, res, next) {
    mssql.connect(config, function (err) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.log('connection complete');
        let request = new mssql.Request();
        let query = 'select * from Discipline';
        request.query(query, function (err, result) {
            if (err) {
                console.log(err.message);
                return;
            }
            else {

                let data = result['recordsets'][0];
                res.json(data);
            }
        });
    });
});

app.post('/drawing-report', jsonParser, function (req, res, next) {
    const projectId = req.body.projectId;
    const disciplineId = req.body.disciplineId;
    console.log(req.body);
    mssql.connect(config, function (err) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.log('connection complete');
        let request = new mssql.Request();
        let query = 'select  * from V_Drawing where IntProjectId= ' + projectId + 'and IntDisciplineId =' + disciplineId;
        let data = {};
        request.query(query, function (err, result) {
            if (err) {
                console.log(err.message);
                return;
            }
            else {


                data['table'] = result['recordsets'][0].map((value, index) => {
                    return { drawingNo: value['DrawingNo'], description: value['DrawingDescription'], fileName: value['FileName'], DrawingStatusId: value['DrawingStatusId'], approveDate: value['DtApproveDate'] }
                });
                console.log(data);
                res.json(data);
            }

        });

    });
});

app.post('/drawing-chart', jsonParser, function (req, res, next) {
    const projectId = req.body.projectId;
    const disciplineId = req.body.disciplineId;
    console.log(req.body)
    mssql.connect(config, function (err) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.log('connection complete');
        let request = new mssql.Request();
        let query = 'select  * from V_Drawing_Report where IntProjectId= ' + projectId + 'and IntDisciplineId =' + disciplineId;
        let data = {};
        request.query(query, function (err, result) {
            if (err) {
                console.log(err.message);
                return;
            }
            else {
                data['chartBar'] = result['recordset'].map((value, index) => {
                    let date = new Date('' + value['DtCreateDate']);
                    let month = date.getMonth();
                    return { label: month, plan: value['DrawingPlan'] + 1000, actual: value['DrawingActual'] + 900, DisciplineName: value['DisciplineName'] }
                });
                data['chartLine'] = result['recordset'].map((value, index) => {
                    let date = new Date('' + value['DtCreateDate']);
                    let month = date.getMonth();
                    return { label: month, plan: value['DrawingPlan'] + 1000, actual: value['DrawingActual'] + 900, DisciplineName: value['DisciplineName'] }
                });
                // data = {
                //     chartBar: [
                //         {
                //             label: 'Jun',
                //             plan: 1000,
                //             actual: 900,
                //             DisciplineName: 'Architectural'
                //         },
                //     ],
                //     chartLine: [
                //         {
                //             label: 'Jun',
                //             plan: 1000,
                //             actual: 900,
                //             DisciplineName: 'Architectural'
                //         },
                //     ]
                // }
                res.json(data);

            }
        });
    });
});

app.post('/manpower-chart', jsonParser, function (req, res, next) {
    const projectId = req.body.projectId;
    const disciplineId = req.body.disciplineId;
    mssql.connect(config, function (err) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.log('connection complete');
        let request = new mssql.Request();
        let query = 'select * from Drawing where IntProjectId=' + projectId + 'and IntDecilpineId=' + disciplineId;
        let data = [];
        request.query(query, function (err, result) {
            if (err) {
                console.log(err.message);
                return;
            }
            else {
                // data['table'] = result['recordsets'][0].map((value, index) => {
                //     return { 'IntCatId': value['IntCatId'], 'CategoryName': value['CategoryName'] }
                // });
                data = [
                    {
                        "drawingNo": "1234",
                        "description": "test1",
                        "revision": "revision",
                        "status": "status",
                        "appDate": "Date1234"
                    },
                    {
                        "drawingNo": "1234",
                        "description": "test1",
                        "revision": "revision",
                        "status": "status",
                        "appDate": "Date1234"
                    }
                ]
            }
        });
        res.json(data);
    });
});

app.post('/manpower-form', jsonParser, function (req, res, next) {
    const projectId = req.body.projectId;
    const disciplineId = req.body.disciplineId;
    mssql.connect(config, function (err) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.log('connection complete');
        let request = new mssql.Request();
        let query = 'select * from Drawing where IntProjectId=' + projectId + 'and IntDecilpineId=' + disciplineId;
        let data = [];
        request.query(query, function (err, result) {
            if (err) {
                console.log(err.message);
                return;
            }
            else {
                // data['table'] = result['recordsets'][0].map((value, index) => {
                //     return { 'IntCatId': value['IntCatId'], 'CategoryName': value['CategoryName'] }
                // });
                data = [
                    {
                        "drawingNo": "1234",
                        "description": "test1",
                        "revision": "revision",
                        "status": "status",
                        "appDate": "Date1234"
                    },
                    {
                        "drawingNo": "1234",
                        "description": "test1",
                        "revision": "revision",
                        "status": "status",
                        "appDate": "Date1234"
                    }
                ]
            }
        });
        res.json(data);
    });
});


app.post('/daily-report', jsonParser, function (req, res, next) {
    const projectId = req.body.projectId;
    const disciplineId = req.body.disciplineId;
    mssql.connect(config, function (err) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.log('connection complete');
        let request = new mssql.Request();
        let query = 'select * from Drawing where IntProjectId=' + projectId + 'and IntDecilpineId=' + disciplineId;
        let data = [];
        request.query(query, function (err, result) {
            if (err) {
                console.log(err.message);
                return;
            }
            else {
                // data['table'] = result['recordsets'][0].map((value, index) => {
                //     return { 'IntCatId': value['IntCatId'], 'CategoryName': value['CategoryName'] }
                // });
                data = [
                    {
                        "drawingNo": "1234",
                        "description": "test1",
                        "revision": "revision",
                        "status": "status",
                        "appDate": "Date1234"
                    },
                    {
                        "drawingNo": "1234",
                        "description": "test1",
                        "revision": "revision",
                        "status": "status",
                        "appDate": "Date1234"
                    }
                ]
            }
        });
        res.json(data);
    });
});

app.post('/daily-form', jsonParser, function (req, res, next) {
    const projectId = req.body.projectId;
    const disciplineId = req.body.disciplineId;
    mssql.connect(config, function (err) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.log('connection complete');
        let request = new mssql.Request();
        let query = 'select * from Drawing where IntProjectId=' + projectId + 'and IntDecilpineId=' + disciplineId;
        let data = [];
        request.query(query, function (err, result) {
            if (err) {
                console.log(err.message);
                return;
            }
            else {
                // data['table'] = result['recordsets'][0].map((value, index) => {
                //     return { 'IntCatId': value['IntCatId'], 'CategoryName': value['CategoryName'] }
                // });
                data = [
                    {
                        "drawingNo": "1234",
                        "description": "test1",
                        "revision": "revision",
                        "status": "status",
                        "appDate": "Date1234"
                    },
                    {
                        "drawingNo": "1234",
                        "description": "test1",
                        "revision": "revision",
                        "status": "status",
                        "appDate": "Date1234"
                    }
                ]
            }
        });
        res.json(data);
    });
});

app.listen(PORT, function () {
    var os = require('os');
    var networkInterfaces = os.networkInterfaces();
    console.log("http://" + networkInterfaces['Wi-Fi'][3

]['address'] + ":" + PORT);
    // console.log('CORS-enabled web server listening on port' + PORT)
})