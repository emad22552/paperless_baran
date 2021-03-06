/*!
*   BaranGroup System v0.0.16
*   Author: Mehran Arjmand & Elyas Ghasemi
*   Website: Baran Group <http://barang.ir>
*   License: Open source - GNU
!*/

"use strict";
function setBirthDate(user) {
    if (user.birth_date) {
        var date = user.birth_date;
        date = date.split("/");
        user.birth_year = date[0];
        user.birth_month = date[1];
        user.birth_day = date[2];
        delete user.birth_date;
    };
    return user;
}

function choose(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function trimArray(array, field) {
    if (!array) {
        return;
    };
    for (var i = array.length - 1; i >= 0; i--) {
        if (field) {
            if (array[i][field] == null || array[i][field] == "") {
                array.splice(i, 1);
            };
        } else if (array[i] == null || array[i] == "") {
            array.splice(i, 1)
        };
    };
}

function getGravatar(email) {
    var Default = "mm";
    Default = encodeURIComponent(Default);
    var size = 200;
    if (email) {
        return "http://1.gravatar.com/avatar/" + md5(email) + "?d=" + Default + "&s=" + size;
    } else {
        return "http://1.gravatar.com/avatar/?d=" + Default + "&s=" + size;
    };
}
var app = angular.module('Baran', ['ngRoute', 'ngProgress']);
app.controller('MainController', ['$scope', '$http', '$location', '$timeout', 'toaster', 'ngProgressFactory', 'ngProgress',
    function($scope, $http, $location, $timeout, toaster, ngProgressFactory, ngProgress) {
        $scope.progressbar = ngProgressFactory.createInstance();
        // Static params
        $scope.majorsList = [{
            "name": "نرم افزار",
            "group": "کامپیوتر"
        }, {
            "name": "سخت افزار",
            "group": "کامپیوتر"
        }, {
            "name": "آی تی",
            "group": "کامپیوتر"
        }, {
            "name": "کاردانی",
            "group": "کامپیوتر"
        }, {
            "name": "قدرت",
            "group": "برق"
        }, {
            "name": "الکترونیک",
            "group": "برق"
        }, {
            "name": "کنترل",
            "group": "برق"
        }, {
            "name": "مخابرات",
            "group": "برق"
        }, {
            "name": "مهندسی پزشکی",
            "group": "مهندسی"
        }, {
            "name": "عمران",
            "group": "مهندسی"
        }, {
            "name": "مکانیک",
            "group": "مهندسی"
        }, {
            "name": "صنایع",
            "group": "مهندسی"
        }, {
            "name": "مواد",
            "group": "مهندسی"
        }, {
            "name": "معماری",
            "group": ""
        }, {
            "name": "نقشه برداری",
            "group": ""
        }, {
            "name": "شیمی",
            "group": ""
        }, {
            "name": "نقاشی",
            "group": ""
        }, {
            "name": "گرافیک",
            "group": ""
        }, {
            "name": "عکاسی",
            "group": ""
        }, {
            "name": "ادبیات فارسی",
            "group": ""
        }, {
            "name": "الهیات",
            "group": ""
        }, {
            "name": "حقوق",
            "group": ""
        }, {
            "name": "حسابداری",
            "group": ""
        }, {
            "name": "دندانپزشکی",
            "group": ""
        }, {
            "name": "فن آوری اطلاعات سلامت",
            "group": ""
        }];
        $scope.lessonsList = ["عربی", "فلسفه", "زیست شناسی", "زبان خارجه", "معماری", "ریاضیات", "شیمی", "فیزیک", "گرافیک", "حسابداری"];
        $scope.agesList = ["ابتدایی", "راهنمایی", "دبیرستان"];
        $scope.freeTimes = {
            days: [{
                title: "شنبه",
                value: "saturday"
            }, {
                title: "یکشنبه",
                value: "sunday"
            }, {
                title: "دوشنبه",
                value: "monday"
            }, {
                title: "سه شنبه",
                value: "tuesday"
            }, {
                title: "چهارشنبه",
                value: "wednesday"
            }, {
                title: "پنجشنبه",
                value: "thursday"
            }, {
                title: "جمعه",
                value: "friday"
            }],
            hours: [{
                from: 8,
                to: 10
            }, {
                from: 10,
                to: 12
            }, {
                from: 12,
                to: 14
            }, {
                from: 14,
                to: 16
            }, {
                from: 16,
                to: 18
            }, {
                from: 18,
                to: 20
            }]
        };
        $scope.entryYear = [];
        for (var i = 1380; i <= 1394; i++) {
            $scope.entryYear.push(i);
        }
        //////////////////////
        $scope.page = {};
        $scope.user = {};
        $scope.messages = [];
        $scope.menus = [];
        $scope.showModal = 'none';
        $scope.count = 0;
        $http.post("/page_data").success(function($json) {
            $scope.user = $json.user;
            // $scope.user.avatar = getGravatar($scope.user.email);
            $scope.messages = $json.messages;
            $scope.menus = $json.menus;
            $scope.notifications = $json.notifications;
            $scope.page = $json.page;
            $scope.version = $json.version;
        }).error(function($data, $status) {
            toaster.error('error!\nError Code' + $status);
        });
        $scope.getMenuLinkClass = function(link) {
            return ('#' + $location.url()) == link ? 'active' : null;
        }
        $scope.getFullName = function($user) {
            var text = "";
            if ($user.first_name) {
                text = $user.first_name + " ";
            }
            if ($user.last_name) {
                text += $user.last_name;
            };
            return text;
        }
        $scope.backToDashboard = function() {
            $location.path("/");
        }
        $scope.getMessageTitle = function() {
            return $scope.messages && $scope.messages.length > 0 ? 'شما ' + $scope.messages.length + ' پیام جدید دارید' : 'پیام جدیدی وجود ندارد.';
        }
        $scope.getNotificationTitle = function() {
            return $scope.notifications && $scope.notifications.length > 0 ? $scope.notifications.length + ' اعلامیه' : 'اعلامیه ای وجود ندارد.';
        }
    }
]).controller("DashboardController", ['$scope', '$http', '$sce', 'toaster',
    function($scope, $http, $sce, toaster) {
        //TODO get this from server
        $scope.quote = {
            style: "bg-green-gradient",
            text: "میدونستی با خرید شارژ از سایت کارت شارژ باران بجز استفاده از خدمات شارژ غیر مستقیم و شارژ وایمکس میتونی تو شاد کردن بچه های ویژه هم ما رو همراهی کنی.",
            title: null,
            link: "http://charge.barang.ir",
            author: null
        }
        $scope.quote.text = $sce.trustAsHtml($scope.quote.text);
        $scope.vote = {
            header: {
                title: "نظر سنجی",
                icon: "fa-ticket"
            },
            question: "چه نامی را برای سایت پیشنهاد میکنید؟",
            answer: "",
            isSending: false
        };
        $scope.getNews = function() {
            $http.get('/news').success(function(data) {
                $scope.news = data;
            }).error(function() {
                toaster.error('خطا در بارگذاری اخبار');
            });
        }
        $scope.sendVote = function() {
            $scope.vote.isSending = true;
            var feedback = {
                text: "voting for " + $scope.vote.question + " is " + $scope.vote.answer,
                allow_writer: true
            }
            $http.post("/feedback", feedback).success(function(data) {
                $scope.vote.isSending = false;
                $scope.vote.answer = "";
                toaster.success("ممنون، رای شما با موفقیت ثبت شد.");
            }).error(function(data, code) {
                $scope.vote.isSending = false;
                toaster.error("متسافانه به مشکل برخوردیم لطفا دوباره تلاش کنید");
            });
        }
        $scope.getNews();
    }
]).controller("LogController", ['$scope', '$http', '$interval', '$routeParams',
    function($scope, $http, $interval, $routeParams) {
        $scope.logsLength = $routeParams.size;
        $scope.isLoading = false;
        $scope.autoReload = false;
        $scope.getLogs = function() {
            $scope.isLoading = true;
            $http.get("/logs_" + $scope.logsLength).success(function(data) {
                $scope.isLoading = false;
                $scope.logs = data.reverse();
            }).error(function(data, code) {
                toaster.error("خطا در دریافت اطلاعات");
                $scope.isLoading = false;
            })
        }
        $scope.getLogs();
        $interval(function() {
            if ($scope.autoReload) {
                $scope.getLogs();
            };
        }, 3000);
    }
]).controller("ProfileController", ['$scope', '$http', 'toaster',
    function($scope, $http, toaster) {
        $scope.isSending = false;
        $http.get("/my_data").success(function(data) {
            $scope.userCopy = data;
        }).error(function(data, code) {
            toaster.error("خطا در بارگذاری اطلاعات")
        });
        $scope.removeSkill = function(skillIndex) {
            if ($scope.userCopy.skills) {
                $scope.userCopy.skills.splice(skillIndex, 1);
            }
        }
        $scope.addSkill = function() {
            if (!$scope.userCopy.skills) {
                $scope.userCopy.skills = [];
            };
            $scope.userCopy.skills.push("");
        }
        $scope.hasError = function() {
            return $scope.profileForm.$error.required || $scope.profileForm.email.$invalid || $scope.profileForm.mobile.$invalid || $scope.userCopy.password != $scope.passwordRepeat;
        }
        $scope.editUser = function(newuser) {
            if (!$scope.hasError() && !$scope.isSending) {
                setBirthDate($scope.userCopy);
                ///////////////////////////
                trimArray($scope.userCopy.skills);
                $scope.isSending = true;
                $http.post("/my_data", $scope.userCopy).success(function(data) {
                    if (data.edit) {
                        toaster.success("پروفایل شما با موفقیت بروزرسانی گردید");
                        $scope.isSending = false;
                        $scope.userCopy = data.data;
                    };
                }).error(function(data, code) {
                    toaster.error("متاسفانه در ارسال اطلاعات خطایی رخ داده.\nکد خطا: " + code);
                    $scope.isSending = false;
                });
            };
        }
        $scope.commitFreeTimes = function() {
            // TODO Complete this part
            console.log($scope.userCopy.freeTimes);
        }
        $scope.getMajorValue = function(major) {
            return major.group ? major.group + '-' + major.name : major.name;
        }
        $scope.showPassword = function(id) {
            $('#' + id).attr("type", "text");
        }
        $scope.hidePassword = function(id) {
            $('#' + id).attr("type", "password");
        }
        // TODO Check this again
        $scope.getPasswordStrength = function() {
            $scope.passwordStrength = 0;
            if ($scope.userCopy.password.length > 5) {
                $scope.passwordStrength += 20;
            }
            if (/[0-9].*[0-9]/.test($scope.userCopy.password)) {
                $scope.passwordStrength += 30;
            }
            if (/[~,!,@,#,$,_,%,^,&,*]/.test($scope.userCopy.password)) {
                $scope.passwordStrength += 30;
            }
            if ($scope.userCopy.password.length > 20) {
                $scope.passwordStrength += 20;
            }
        }
    }
]).controller("AddContactController", ['$scope', '$http', 'toaster',
    function($scope, $http, toaster) {
        $scope.Deactive = false;
        $scope.contact = {
            gender: true,
            skills: [],
            _comments: []
        };
        $scope.reset = function() {
            $scope.contact = {
                gender: true,
                skills: [],
                _comments: []
            };
            $scope.myForm.$setUntouched();
        };
        $scope.submits = function() {
            if (!($scope.hasError())) {
                $scope.Deactive = true;
                /*Process on user data*/
                if ($scope.contact.birth_date) {
                    setBirthDate($scope.contact)
                }
                // trim arrays
                trimArray($scope.contact.skills);
                trimArray($scope.contact._comments, "comment");
                $http.post('/new_user', $scope.contact).
                success(function(data) {
                    if (data.add == true) {
                        toaster.info('اطلاعات شما با موفقیت ثبت شد');
                        $scope.reset();
                    } else if (data.exists == true) {
                        toaster.error('شماره تلفن در سایت موجود است');
                    } else if (data.have_permission == false) {
                        toaster.info('شما مجاز به ارسال این درخواست نیستید');
                    } else {
                        toaster.error('اطلاعات معتبر نیستند');
                    };
                    $scope.Deactive = false;
                }).
                error(function(data, code) {
                    toaster.error('خطا در برقراری ارتباط با سرور');
                    $scope.Deactive = false;
                });
            }
        };
        $scope.hasError = function() {
            return $scope.myForm.$error.required || $scope.myForm.email.$invalid || $scope.myForm.mobile.$invalid;
        };
        $scope.getMajorValue = function(major) {
            return major.group ? major.group + '-' + major.name : major.name;
        };
    }
]).controller('ContactListController', ['$scope', '$http', '$timeout', 'toaster',
    function($scope, $http, $timeout, toaster) {
        $scope.Deactive = false;
        $scope.isLoading = false;
        $scope.isSending = false;
        $scope.selectedUser = null;
        $scope.datatable = {
            totalCount: 0,
            indicators: [],
            indicatorSize: 0,
            currentPage: -1,
            listSize: 10
        };
        $http.post("/users").
        success(function($json) {
            $scope.canEdit = $json.can_edit;
            $scope.paging(1);
        }).
        error(function($data, $status) {
            toaster.error('error!\nError Code' + $status);
        });
        $scope.selectUser = function(user) {
            if ($scope.selectedUser == null || $scope.selectedUser._id != user._id) {
                $scope.selectedUser = angular.copy(user);
            } else {
                $scope.selectedUser = null;
            }
        }
        $scope.getMajorValue = function(major) {
            return major.group ? major.group + '-' + major.name : major.name;
        }
        $scope.paging = function(page, force) {
            if ((isNaN(page) || (page > $scope.datatable.maxPage && !force) || page <= 0)) {
                $scope._page = $scope.datatable.currentPage;
                return;
            };
            if (!force && page == $scope.datatable.currentPage) {
                $scope._page = $scope.datatable.currentPage;
                return;
            };
            $scope.isLoading = true;
            $http.post("/users", {
                from: String((page - 1) * $scope.datatable.listSize),
                to: String(page * $scope.datatable.listSize),
                query: $scope.query
            }).success(function(json) {
                $scope.selectedUser = null;
                $scope.datatable.totalCount = json.count;
                $scope.datatable.maxPage = Math.ceil($scope.datatable.totalCount / $scope.datatable.listSize);
                $scope.datatable.currentPage = Number(page);
                $scope.users = json.data;
                $scope._page = $scope.datatable.currentPage;
                $scope.isLoading = false;
            }).error(function($data, $status) {
                toaster.info('error!\nError Code' + $status);
                $scope.isLoading = false;
            });
        }
        $scope.hasError = function() {
            return $scope.myForm.$error.required || $scope.myForm.email.$invalid || $scope.myForm.mobile.$invalid;
        }
        $scope.editUser = function(newUser) {
            if (!$scope.hasError()) {
                trimArray(newUser.skills);
                trimArray(newUser._comments, "comment");
                // remove previous comment to protect duplicates on server
                if (newUser && newUser._comments) {
                    for (var i = 0; i < newUser._comments.length; i++) {
                        if (newUser._comments[i]._writer) {
                            newUser._comments.splice(i--, 1);
                        }
                    }
                }
                setBirthDate(newUser);
                $scope.isSending = true;
                $http.post("/edit_users", newUser).success(function(data) {
                    if (data.exists == true) toaster.info("شماره تلفن وارد شده در سیستم موجود است!");
                    else if (data.edit) toaster.info("کاربر مورد نظر ویرایش گردید");
                    else toaster.info("ویرایش نشد!");
                    $scope.selectedUser = null;
                    $scope.paging($scope.datatable.currentPage, true);
                    $scope.isSending = false;
                }).error(function(data, code) {
                    toaster.info("خطا در ارتباط با سرور");
                    $scope.isSending = false;
                });
            }
        }
        $scope.removeComment = function(user, commentIndex) {
            if ($scope.canEdit && !user._comments[commentIndex]._writer) {
                user._comments.splice(commentIndex, 1);
            };
        }
        $scope.addComment = function(user) {
            if ($scope.canEdit) {
                if (!user._comments) {
                    user._comments = [];
                };
                user._comments.push({});
            };
        }
        $scope.removeSkill = function(user, skillIndex) {
            if ($scope.canEdit) {
                user.skills.splice(skillIndex, 1);
            };
        }
        $scope.addSkill = function(user) {
            if ($scope.canEdit) {
                if (!user.skills) {
                    user.skills = [];
                };
                user.skills.push("");
            };
        }
        $scope.search = function() {
            if ($scope._query.quick_search == "") {
                $scope.clearSearch();
            };
            $scope.selectedUser = null;
            $scope.query = angular.copy($scope._query);
            $scope._query = null;
            $scope.paging(1, true);
        }
        $scope.clearSearch = function() {
            $scope.query = null;
            $scope._query = null;
            $scope.paging(1, true);
        }
        $scope.RemoveCriteria = function(param) {
            delete $scope.query[param];
            $scope.paging(1, true);
        }
    }
]).controller('SendFeedBackController', ['$scope', '$http', 'toaster',
    function($scope, $http, toaster) {
        $scope.isSending = false;
        $scope.Deactive = false;
        $scope.sendFeedBack = function() {
            $scope.isSending = true;
            $http.post("/feedback", $scope.feedback).success(function(data) {
                $scope.isSending = false;
                toaster.success('پیام شما با موفقیت ارسال شد.');
                $scope.backToDashboard();
            }).error(function(code) {
                $scope.isSending = false;
                toaster.error('ارسال با خطا مواجه شد.');
            });
        }
    }
]).controller('BugReportController', ['$scope', '$http', 'toaster',
    function($scope, $http, toaster) {
        $scope.isSending = false;
        $scope.sendBug = function() {
            if ($scope.bug) {
                $scope.isSending = true;
                //convert bug to feedback
                var feedback = {
                    text: "[" + $scope.bug.text + "] در قسمت [" + $scope.bug.section + "]",
                    allow_writer: true
                }
                $http.post("/feedback", feedback).success(function(data) {
                    toaster.success("درخواست شما ارسال شد.");
                    $scope.isSending = false;
                    $scope.backToDashboard();
                }).error(function(data, code) {
                    toaster.error("ارسال با خطا مواجه شد.\nکد خطا: " + code);
                    $scope.isSending = false;
                })
            };
        }
    }
]).controller('BirthdaySmsController', ['$scope', '$http', 'toaster',
    function($scope, $http, toaster) {
        var $isSending = false;
        $scope.maxCharCount = 70;
        $scope.smsSetting = {
            text: ""
        };
        $scope.getSMSCount = function() {
            // TODO fix this
            return Math.ceil($scope.smsSetting.text.length / $scope.maxCharCount);
        }
        $http.get("/birthday_sms").success(function(data) {
            $scope.smsSetting = data;
        }).error(function(data, code) {
            toaster.error("خطا در دریافت اطلاعات");
        });
        $scope.saveSetting = function() {
            $scope.isSending = true;
            $http.post("/birthday_sms", $scope.smsSetting).success(function(data) {
                $scope.isSending = false;
                toaster.success("تنظیمات با موفقیت ذخیره شد.");
                $scope.backToDashboard();
            }).error(function(data, code) {
                $scope.isSending = false;
                toaster.error("در ارسال با خطا مواجه شدیم");
            })
        }
    }
]).controller('UserReportController', ['$scope', '$http', '$sce', '$filter', 'toaster',
    function($scope, $http, $sce, $filter, toaster) {

        $scope.report = [];

        $http.get("/users_report").success(function(data) {
            $scope.drawChart(data["report_by_year"]);
        }).error(function(data, code) {
            toaster.error("خطا در بارگذاری اطلاعات\nکد خطا: " + code);
        })
        $scope.drawChart = function(enteredData) {
            var data = {
                labels: [],
                datasets: []
            };
            var createLabels = true;
            var colors = ["#3c8dbc", "#00c0ef", "#00a65a", "#f39c12", "#f56954", "#605ca8", "#D81B60", "#001F3F"];
            var x = 0;
            angular.forEach(enteredData, function(value, name) {
                data.datasets.push({
                    label: name,
                    fillColor: colors[x],
                    strokeColor: colors[x],
                    highlightFill: colors[x],
                    highlightStroke: colors[x],
                    data: []
                });
                angular.forEach(value, function(innerValue, innerName) {
                    data.datasets[data.datasets.length - 1].data.push(innerValue);
                    if (createLabels) {
                        data.labels.push($filter('farsimal')(innerName));
                    };
                });
                createLabels = false;
                x = (x + 1) % colors.length;
            });
            var barChartCanvas = $("#reportChart").get(0).getContext("2d");
            var barChartData = data;
            var barChartOptions = {
                scaleBeginAtZero: true,
                scaleShowGridLines: true,
                scaleGridLineColor: "rgba(0,0,0,.05)",
                scaleGridLineWidth: 1,
                scaleShowHorizontalLines: true,
                scaleShowVerticalLines: true,
                barShowStroke: true,
                barStrokeWidth: 2,
                barValueSpacing: 5,
                barDatasetSpacing: 1,
                responsive: true,
                datasetFill: true,
                legendTemplate: "<ul class=\"nav nav-pills nav-stacked no-padding\"><% for (var i=0; i<datasets.length; i++){%><li><a><i class=\"fa fa-circle pull-left\" style=\"color:<%=datasets[i].fillColor%>\"></i> <span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></a></li><%}%></ul>",
                maintainAspectRatio: false
            };
            $scope.reportByYearChart = {
                chart: null,
                legend: null
            };
            $scope.reportByYearChart.chart = new Chart(barChartCanvas).Bar(barChartData, barChartOptions);
            $scope.reportByYearChart.legend = $sce.trustAsHtml($scope.reportByYearChart.chart.generateLegend());
        }
    }
]).controller('SubmitDispatchController', ['$scope', '$http', 'toaster',
    function($scope, $http, toaster) {
        $scope.DefaultDispatch = function() {
            return {
                costs: []
            }
        }
        $scope.isLoading = true;
        $http.get('/new_dispatch').success(function(data) {
            $scope.isLoading = false;
            $scope.Stations = data.stations;
        }).error(function(data, code) {
            $scope.isLoading = false;
            toaster.error('خطا رد دریافت لیست مراکز');
        });
        $scope.SendDispatch = function() {
            if ($scope.hasError()) {
                return;
            };
            trimArray($scope.dispatch.costs, 'cost');
            $scope.isSending = true;
            $http.post('/new_dispatch', $scope.dispatch).success(function(data) {
                $scope.isSending = false;
                toaster.success('ثبت اعزام موفقیت آمیز بود.');
                $scope.backToDashboard();
            }).error(function(data, code) {
                $scope.isSending = false;
                toaster.error('خطا ثبت اعزام.');
            });
        }
        $scope.hasError = function() {
            return $scope.SubmitDispatchForm.$invalid;
        }
        $scope.dispatch = $scope.DefaultDispatch();
    }
]).controller('StationController', ['$scope', '$http', 'toaster',
    function($scope, $http, toaster) {
        $scope.DefaultStation = function() {
            return {
                phone_numbers: [""]
            }
        }
        $scope.GetStations = function() {
            $scope.isLoading = true;
            $http.post("/station", {
                type: 'list'
            }).success(function(data) {
                $scope.isLoading = false;
                $scope.StationList = data;
            }).error(function(data, code) {
                $scope.isLoading = false;
                toaster.error("خطا در دریافت لیست مراکز")
            });
        }
        $scope.AddStation = function(station) {
            if ($scope.hasError()) {
                return;
            };
            trimArray(station.phone_numbers);
            $scope.isSending = true;
            $http.post("/station", {
                type: 'add',
                data: station
            }).success(function(data) {
                $scope.isSending = false;
                if (data.add) {
                    $scope.StationList.push(data.data);
                    toaster.success("مرکز با موفقیت اضافه شد.");
                    $scope.SelectedStation = null;
                } else {
                    toaster.error("خطا در ذخیره اطلاعات مرکز.")
                };
            }).error(function(data, code) {
                $scope.isSending = false;
                toaster.error("خطا در ذخیره اطلاعات مرکز.")
            });
        }
        $scope.EditStation = function(station) {
            if ($scope.hasError()) {
                return;
            };
            trimArray(station.phone_numbers);
            $scope.isSending = true;
            $http.post("/station", {
                type: 'edit',
                data: station
            }).success(function(data) {
                $scope.isSending = false;
                if (data.edit) {
                    toaster.success("مرکز با موفقیت ویرایش شد.");
                    $scope.SelectedStation = null;
                } else {
                    toaster.error("خطا در ویرایش مرکز.")
                };
            }).error(function(data, code) {
                $scope.isSending = false;
                toaster.error("خطا در ویرایش مرکز.")
            });
        }
        $scope.selectStation = function(station) {
            if ($scope.SelectedStation == null || $scope.SelectedStation._id != station._id) {
                $scope.SelectedStation = angular.copy(station);
                $scope._type = 'edit';
                $scope.AddStationForm.$setPristine();
            }
        }
        $scope.hasError = function() {
            return ($scope.AddStationForm.$invalid || (!$scope.SelectedStation.male && !$scope.SelectedStation.female) || $scope.SelectedStation.age_from > $scope.SelectedStation.age_to && !$scope.SelectedStation.phone_numbers[0])
        }
        $scope.GetStations();
    }
]).controller('ExperienceController', ['$scope', '$http', 'toaster', function ($scope, $http, toaster) {

    $scope.tasks = [];
    $scope.task = {};

    $scope.init = function() {
        $http.get("/experience")
        .success(function (data) {
            $scope.tasks = data;
        })
        .error(function(data, code) {
            toaster.error("خطا در برقراری ارتباط با سرور ...");
            console.log("error" + code + data );
        });
    }

    $scope.submitExperience = function () {
        if (!$scope.AddExperienceForm.$invalid) {
            $scope.isSending = true;
            $http.post('/experience', $scope.experience)
            .success(function (data) {
                $scope.isSending = false;
                toaster.success("ممنون تجربه شما ثبت شد.");
                $scope.backToDashboard();
            })
            .error(function(data, code) {
                $scope.isSending = false;
                toaster.error("خطا در برقراری ارتباط لطفا دوباره تلاش کنید.");
                console.log("error" + code + data );
            });
        }else{
            toaster.error("اطلاعات فرم کامل نیست.")
        }
    }

    $scope.init();

}]).controller('MaliReportController', ['$scope', '$http', 'toaster',
    function($scope, $http, toaster) {
        $scope.init = function() {
            $scope.isLoading = true;
            $scope.selected = false;
            $http.get("/mali", {
                params: {
                    type: 'list',
                }
            }).success(function(data) {
                $scope.isLoading = false;
                $scope.finance = data;
            }).error(function(data, code) {
                $scope.isLoading = false;
                toaster.error("خطا در بارگزاری.")
            });
        }
        $scope.selectRow = function(row) {
            if ($scope.selected && row._id == $scope.selected._id) {
                return;
            };
            $scope.selected = row;
            // fixme: @elyas get_data dosen't work in /mali
            $http.get('/mali', {
                params: {
                    type: 'get_data',
                    _id: row._id
                }
            }).success(function(data) {
                $scope.selected = data;
            }).error(function(data, code) {
                toaster.error("خطای سرور.");
            });
        }
        $scope.init();
    }
]).controller('DispatchReportController', ['$scope', '$http', 'toaster',
    function($scope, $http, toaster) {
        $scope.init = function() {
            $scope.isLoading = true;
            $scope.selected = false;
            $http.get('/dispatch', {
                params: {
                    type: 'list'
                }
            }).success(function(data) {
                $scope.isLoading = false;
                $scope.dispatches = data;
            }).error(function(data, code) {
                $scope.isLoading = false;
                toaster.error('خطای خواندن اطلاعات');
            });
        }
        $scope.selectRow = function(row) {
            if ($scope.selected && $scope.selected._id == row._id) {
                return;
            };
            $scope.selected = row;
            // fixme: @elyas get_data dosen't work in /dispatch
            $http.get('/dispatch', {
                params: {
                    type: 'get_data',
                    _id: row._id
                }
            }).success(function(data) {
                $scope.selected = data;
            }).error(function(data, code) {
                toaster.error("خطای سرور.");
            });
        }
        $scope.init();
    }
]).controller('SendSmsController', ['$scope', '$http', 'toaster',
    function($scope, $http, toaster) {
        $scope.sms = {
            text: '',
            contacts: {}
        }
        $scope.isLoading = false;
        $scope.maxCharCount = 70;
        $scope.getPanelDetail = function() {
            $scope.isLoading = true;
            $http.get("/send_sms").success(function(data) {
                $scope.isLoading = false;
                $scope.panel = data;
            });
        }
        $scope.getSMSCount = function() {
            // TODO fix this
            return Math.ceil($scope.sms.text.length / $scope.maxCharCount);
        }
        $scope.sendSMS = function() {
            if (!$scope.sms.contacts.gender || !($scope.sms.contacts.gender.female || $scope.sms.contacts.gender.male)) {
                toaster.warning("لطفا حداقل یک جنسیت را  انتخاب نمایید.");
                return;
            };
            $http.post("/send_sms", $scope.sms).success(function(data) {
                if (data.send == true) toaster.success(data.count + " پیام با موفقیت ارسال شد.");
                else toaster.error("خطا در ارسال");
            }).error(function(data, code) {
                toaster.error("متاسفانه در حال حاظر قادر به ارسال پیامک نیستیم، لطفا دوباره تلاش کنید.");
            });
        }
        $scope.getPanelDetail();
    }
]).controller('TaskAssignController', ['$scope', '$http', 'toaster',
    function($scope, $http, toaster) {
        $scope.getTasks = function() {
            $scope.isLoading = true;
            $http.get('/tasks').success(function(data) {
                $scope.taskList = data;
                $scope.taskList = $scope.sortTasksRecursive($scope.taskList);
                $scope.isLoading = false;
            }).error(function() {
                toaster.error("دریافت لیست وظایف با مشکل مواجه شد.")
                $scope.isLoading = false;
            });
        }
        $scope.init = function() {
            $scope.isLoading = true;
            $scope.getTasks();
            $scope.task = {
                members: []
            };
            $('#input-member').tokenInput('clear');
            angular.forEach($scope.task.members, function(value) {
                $('#input-member').tokenInput('add', {
                    _id: value._id,
                    name: value.name
                });
            });
            $scope.isLoading = false;
        }
        $scope.sortTasksRecursive = function(tasks, array, _parent) {
            if (!array) {
                var array = [];
            };
            for (var i = 0; i < tasks.length; i++) {
                if (tasks[i]._parent == _parent) {
                    var data = tasks.splice(i, 1)[0];
                    array.push(data);
                    $scope.sortTasksRecursive(tasks, array, data._id);
                    i--;
                };
            };
            return array;
        }
        $scope.hasError = function() {
            return $scope.taskForm.$invalid;
        }
        $scope.getTaskTitle = function(task) {
            return s.repeat('-', task.depth * 2) + ' ' + task.title;
        }
        $scope.assigntask = function() {
            if ($scope.hasError()) {
                return;
            }
            $scope.isSending = true;
            $http.post('/task_members', $scope.task).success(function(data) {
                $scope.isSending = false;
                $scope.init();
                toaster.success("با موفقت ثبت شد.");
            }).error(function() {
                $scope.isSending = false;
                toaster.error("با خطا مواجه شد.");
            });
        }
        $scope.init();
    }
]).controller('MyActivityController', ['$scope', '$http', 'toaster', function($scope, $http, toaster){

    $scope.init = function () {
        $http.get('/my_act', {
            params: {
                from: 0,
                to: 10
            }
        })
        .success(function (data) {
            $scope.acts = data.data;
        })
        .error(function (data, code) {
            toaster.error('خطا در برقراری ارتباط');
        });
    }

    $scope.init();

}]).controller('NewsController', ['$scope', '$http', 'toaster',
    function($scope, $http, toaster) {
        $scope.init = function() {
            $scope.news = {};
            $scope.newsForm.$setPristine();
            $scope.isSending = false;
        }
        $scope.hasError = function() {
            return $scope.newsForm.$invalid;
        }
        $scope.addNews = function(news) {
            if ($scope.hasError()) {
                return;
            };
            $scope.isSending = true;
            $http.post('/news', {
                type: 'add',
                data: news
            }).success(function(data) {
                $scope.isSending = false;
                if (data.err) {
                    toaster.error("با خطا مواجه شد.");
                    return;
                };
                $scope.init();
                toaster.success("با موفقت ثبت شد.");
            }).error(function(data, code) {
                $scope.isSending = false;
                toaster.error("با خطا مواجه شد.");
            });
        }
    }
]).controller('ExperienceShowController', ['$scope', '$http', 'toaster',
    function($scope, $http, toaster) {
        $scope.init = function() {
            $scope.news = {};
            $scope.newsForm.$setPristine();
            $scope.isSending = false;
        }
        $scope.hasError = function() {
            return $scope.newsForm.$invalid;
        }
        $scope.addNews = function(news) {
            if ($scope.hasError()) {
                return;
            };
            $scope.isSending = true;
            $http.post('/news', {
                type: 'add',
                data: news
            }).success(function(data) {
                $scope.isSending = false;
                if (data.err) {
                    toaster.error("با خطا مواجه شد.");
                    return;
                };
                $scope.init();
                toaster.success("با موفقت ثبت شد.");
            }).error(function(data, code) {
                $scope.isSending = false;
                toaster.error("با خطا مواجه شد.");
            });
        }
    }
]).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardController'
        }).when('/profile', {
            templateUrl: 'views/profile.html',
            controller: 'ProfileController'
        }).when('/contact_list', {
            templateUrl: 'views/contact-list.html',
            controller: 'ContactListController'
        }).when('/new-user', {
            templateUrl: 'views/add-contact.html',
            controller: 'AddContactController'
        }).when('/logs/:size', {
            templateUrl: 'views/log.html',
            controller: 'LogController'
        }).when('/birthday-sms', {
            templateUrl: 'views/birthday-sms.html',
            controller: 'BirthdaySmsController'
        }).when('/send-sms', {
            templateUrl: 'views/send-sms.html',
            controller: 'SendSmsController'
        }).when('/users-report', {
            templateUrl: 'views/users-report.html',
            controller: 'UserReportController'
        }).when('/task-assign', {
            templateUrl: 'views/task-assign.html',
            controller: 'TaskAssignController'
        }).when('/submit-dispatch', {
            templateUrl: 'views/submit-dispatch.html',
            controller: 'SubmitDispatchController'
        }).when('/news', {
            templateUrl: 'views/news.html',
            controller: 'NewsController'
        }).when('/stations', {
            templateUrl: 'views/stations.html',
            controller: 'StationController'
        }).when('/experience', {
            templateUrl: 'views/experience.html',
            controller: 'ExperienceController'
        }).when('/mali', {
            templateUrl: 'views/mali-report.html',
            controller: 'MaliReportController'
        }).when('/dispatch', {
            templateUrl: 'views/dispatch-report.html',
            controller: 'DispatchReportController'
        }).when('/experience/show', {
            templateUrl: 'views/experience_show.html',
            controller: 'ExperienceShowController'
        }).when('/bug-report', {
            templateUrl: 'views/bug-report.html',
            controller: 'BugReportController'
        }).when('/feedback', {
            templateUrl: 'views/send-feedback.html',
            controller: 'SendFeedBackController'
        }).when('/my-activity', {
            templateUrl: 'views/my-activity.html',
            controller: 'MyActivityController'
        }).when('/faq', {
            templateUrl: 'views/faq.html'
        }).when('/under-construct', {
            templateUrl: 'views/under-construct.html'
        }).when('/404', {
            templateUrl: 'views/404.html'
        }).when('/403', {
            templateUrl: 'views/403.html'
        }).otherwise({
            redirectTo: '/404'
        });
    }
]);
app.factory('toaster', ['$rootScope', '$timeout',
    function($rootScope, $timeout) {
        $rootScope.alerts = [];
        return {
            success: function(message) {
                $rootScope.alerts.push({
                    cssClass: "alert-success",
                    description: message
                });
                this.startDestroyer(2500);
            },
            error: function(message) {
                $rootScope.alerts.push({
                    cssClass: "alert-danger",
                    description: message
                });
                this.startDestroyer(2500);
            },
            info: function(message) {
                $rootScope.alerts.push({
                    cssClass: "alert-info",
                    description: message
                });
                this.startDestroyer(2500);
            },
            startDestroyer: function(time) {
                $timeout(function() {
                    $rootScope.alerts.shift();
                }, time);
            }
        };
    }
]);

// sevices
app.run(["$rootScope", "ngProgressFactory", "toaster",
    function($rootScope, ngProgressFactory, toaster) {
        $rootScope.progressbar = ngProgressFactory.createInstance();
        $rootScope.progressbar.setParent(document.getElementById('wrapper'));
        $rootScope.progressbar.setColor('#F0AD4E');
        $rootScope.progressbar.setHeight('3px');
        $rootScope.progressbar.setAbsolute();
        $rootScope.$on('$routeChangeStart', function() {
            $rootScope.progressbar.start();
        });
        $rootScope.$on('$routeChangeSuccess', function() {
            $rootScope.progressbar.complete();
        });
        $rootScope.$on('$routeChangeError', function() {
            $rootScope.progressbar.stop();
            toaster.error('خطا در برقراری ارتباط...');
        });
    }
]);

// filters
app.filter('farsimal', function() {
    return function(item) {
        // todo: @mehran complete dictionary
        if (!item) {
            return;
        };
        var dic = [{
            en: 'true',
            fa: 'بله'
        }, {
            en: 'false',
            fa: 'خیر'
        }, {
            en: 'male',
            fa: 'مرد'
        }, {
            en: 'female',
            fa: 'زن'
        }, {
            en: 'all_active',
            fa: 'فعال'
        }, {
            en: '',
            fa: ''
        }];
        for (var i = 0; i < dic.length; i++) {
            if (item === true) {
                return 'بله';
            }
            if (item === false) {
                return 'خیر';
            };
            if (item.toLowerCase() == dic[i].en.toLowerCase()) {
                return dic[i].fa;
            };
        };
        return item;
    };
}).filter('fullname', function() {
    return function(item) {
        var text = "";
        if (item.first_name) {
            text = item.first_name + " ";
        }
        if (item.last_name) {
            text += item.last_name;
        };
        return text;
    }
}).filter('toman', function() {
    return function(item) {
        return item ? s.numberFormat(item, 0, ".", ",") + " تومان" : "";
    }
});

// note: [BOX HTML].box.box-solid>.box-header.with-border>h2.box-title^.box-body+.box-footer
