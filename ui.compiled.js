	//
	// Disclaimer: This is my first time using React, I'm using this project to
	// experiment with this framework, so please forgive me for my code.
	// Also, I really should spend time on practicing these questions, rather than
	// writing this mini application. :D But all contribution and feedback is
	// welcome.
	//

	// Source: http://coenraets.org/blog/2014/12/animated-page-transitions-with-react-js/
	var router = (function () {
		"use strict";

		var routes = [];

		function addRoute(route, handler) {
			routes.push({parts: route.split('/'), handler: handler});
		}

		function load(route) {
			window.location.hash = route;
		}

		function start() {
			var path = window.location.hash.substr(1),
				parts = path.split('/'),
				partsLength = parts.length;

			for (var i = 0; i < routes.length; i++) {
				var route = routes[i];
				if (route.parts.length === partsLength) {
					var params = [];
					for (var j = 0; j < partsLength; j++) {
						if (route.parts[j].substr(0, 1) === ':') {
							params.push(parts[j]);
						} else if (route.parts[j] !== parts[j]) {
							break;
						}
					}
					if (j === partsLength) {
						route.handler.apply(undefined, params);
						return;
					}
				}
			}
		}

		window.onhashchange = start;

		return {
			addRoute: addRoute,
			load: load,
			start: start
		};
	}());

	// Source: http://coenraets.org/blog/2014/12/animated-page-transitions-with-react-js/
	var PageSlider = {
		getInitialState: function () {
			return {
				history: [],
				pages: [],
				animating: false
			}
		},
		componentDidUpdate: function() {
			// var skippedCurrentFrame = false,
			// 	pageEl = this.getDOMNode().lastChild,
			// 	pages = this.state.pages,
			// 	l = pages.length,
			// 	transitionEndHandler = function() {
			// 		pageEl.removeEventListener('webkitTransitionEnd', transitionEndHandler);
			// 		pages.shift();
			// 		this.setState({pages: pages});
			// 	}.bind(this),
			// 	animate = function() {
			// 		if (!skippedCurrentFrame) {
			// 			skippedCurrentFrame = true;
			// 			requestAnimationFrame(animate.bind(this));
			// 		} else if (l > 0) {
			// 			// pages[l - 1].props.position = "center transition";
			// 			pages[l - 1].position = "page-center page-transition";
			// 			this.setState({pages: pages, animating: false});
			// 			pageEl.addEventListener('webkitTransitionEnd', transitionEndHandler);
			// 		}
			// 	};

			// if (this.state.animating) {
			// 	requestAnimationFrame(animate.bind(this));
			// }
		},
		slidePage: function (page) {
			// var history = this.state.history,
			// 	pages = this.state.pages,
			// 	l = history.length,
			// 	hash = window.location.hash,
			// 	position = "page-center";

			// if (l === 0) {
			// 	history.push(hash);
			// } else if (hash === history[l - 2]) {
			// 	history.pop();
			// 	position = "page-left";
			// } else {
			// 	history.push(hash);
			// 	position = "page-right";
			// }

			// pages.push({page: page, position: position});

			// this.setState({history: history, pages: pages, animating: position!=="page-center"});
			this.setState({pages: [{page: page, position: ''}]})
		},
		render: function () {
			var content = this.state.pages.map(function(item, i) {
				return (
					React.createElement("div", {className: "page " + item.position, key: i}, 
						React.createElement("div", {className: "container"}, 
							item.page
						)
					)
				);
			});

			return (
				React.createElement("div", {className: "pageslider-container"}, 
					content
				)
			);
		}
	};

	var App = React.createClass({displayName: 'App',
		componentDidMount: function() {
			$(React.findDOMNode(this)).find('.button-collapse').sideNav();
		},
		render: function() {
			return (
				React.createElement("div", null, 
					React.createElement("nav", {className: "teal lighten-1", role: "navigation"}, 
						React.createElement("div", {className: "nav-wrapper container"}, React.createElement("a", {id: "logo-container", href: "#", className: "brand-logo"}, "KRESZ teszt"), 
							React.createElement("ul", {className: "right hide-on-med-and-down"}, 
								React.createElement("li", null, React.createElement("a", {href: "#"}, "??j teszt")), 
								React.createElement("li", null, React.createElement("a", {href: "#info"}, "Inf??")), 
								React.createElement("li", null, React.createElement("a", {href: "#statistics"}, "Statisztika"))
							), 
							React.createElement("ul", {id: "nav-mobile", className: "side-nav"}, 
								React.createElement("li", null, React.createElement("a", {href: "#"}, "??j teszt")), 
								React.createElement("li", null, React.createElement("a", {href: "#info"}, "Inf??")), 
								React.createElement("li", null, React.createElement("a", {href: "#statistics"}, "Statisztika"))
							), 
							React.createElement("a", {href: "#", 'data-activates': "nav-mobile", className: "button-collapse"}, React.createElement("i", {className: "mdi-navigation-menu"}))
						)
					), 

					React.createElement(Content, null)
				)
			);
		}
	});

	var Content = React.createClass({displayName: 'Content',
		mixins: [PageSlider],
		componentDidMount: function() {
			router.addRoute('', function() {
				this.slidePage(React.createElement(WelcomePage, {key: "home"}));
			}.bind(this));
			router.addRoute('info', function() {
				this.slidePage(React.createElement(InfoPage, {key: "info"}));
			}.bind(this));
			router.addRoute('category/:categoryId', function(categoryId) {
				this.slidePage(React.createElement(Tester, {key: categoryId, categoryId: categoryId}));
			}.bind(this));
			router.addRoute('statistics', function() {
				this.slidePage(React.createElement(Statistics, {key: "stats"}));
			}.bind(this));
			
			router.start();
		}
	});

	var navigate = function(where) {

	}

	var WelcomePage = React.createClass({displayName: 'WelcomePage',
		componentDidMount: function() {
			var self = this;
			// This is a temporary hack
			if (Object.keys(model.getCategories()).length == 0) {
				setTimeout(function() {
					// Force update after 2 seconds, the list of categories is probably loaded by that time
					self.forceUpdate();
				}, 2000);
			}
		},
		render: function () {
			var self = this;

			var categoriesHtml = $.map(model.getCategories(), function (category) {
				return (
					React.createElement("a", {className: "collection-item", href: '#category/' + category.id, key: category.id}, category.title)
				);
			});

			var categoryTestsHtml = $.map(model.getCategories(), function (category) {
				return (
					React.createElement("a", {className: "collection-item", href: 'tests/' + category.id + '.html', key: category.id}, category.title)
				);
			});

			return (
				React.createElement("div", null, 
					React.createElement("div", {className: "card"}, 
						React.createElement("div", {className: "card-content"}, 
							React.createElement("span", {className: "card-title grey-text text-darken-4"}, React.createElement("h4", null, "KRESZ teszt")), 
							React.createElement("p", null, 
								"??dv a KRESZ teszt alkalmaz??sban! Itt felk??sz??lhetsz a KRESZ vizsg??dra a meg??jult 2015-??s vizsga val??s k??rd??seivel." + ' ' +
								"Tov??bbi inform??ci?? a tesztr??l, a k??rd??sekr??l ??s az alkalmaz??sr??l az ", React.createElement("a", {href: "#info"}, React.createElement("strong", null, "Inf??")), " oldalon.", 
								React.createElement("br", null), React.createElement("br", null), 
								"A k??rd??sadatb??zis a szakoe.hu oldalr??l sz??rmazik, annak szerz??i jogaival a E-Educatio Inform??ci??technol??gia Zrt. rendelkezik.", 
								React.createElement("br", null), React.createElement("br", null), 
								"E-mail: ujkreszteszt (a) gmail.com"
							)
						)
					), 

					React.createElement("div", {className: "collection with-header card"}, 
						React.createElement("div", {className: "collection-header"}, React.createElement("strong", null, "Teszt ind??t??sa ??? V??lassz kateg??ri??t!")), 
						categoriesHtml
					), 

					React.createElement("div", {className: "collection with-header card"}, 
						React.createElement("div", {className: "collection-header"}, React.createElement("strong", null, "K??rd??sbank b??ng??sz??se"), React.createElement("br", null), "B??ng??szd az egyes kateg??ri??k teljes k??rd??sbankj??t (az ??sszes k??rd??st)."), 
						categoryTestsHtml
					)
				)
			);
		}
	});

	var InfoPage = React.createClass({displayName: 'InfoPage',
		render: function () {
			return (
				React.createElement("div", null, 
					React.createElement("div", {className: "card"}, 
						React.createElement("div", {className: "card-content"}, 
							React.createElement("span", {className: "card-title grey-text text-darken-4"}, React.createElement("h4", null, "A KRESZ vizsg??r??l")), 
							React.createElement("p", null, "A KRESZ vizsga egy feletv??laszt??s teszt, azaz minden k??rd??sn??l t??bb lehets??ges megold??s k??z??l kell kiv??lasztani a helyeset. Egy k??rd??s megv??laszol??s??ra 60 m??sodperc (1 perc) ??ll rendelkez??sre. A teszt kateg??ri??t??l f??gg??en 55 (A - motor, B - szem??lyg??pkocsi) vagy 25 (\"nagy kateg??ri??k\") k??rd??sb??l ??ll, melyek 1 vagy 3 pontot ??rnek. A legt??bb k??rd??s 1 pontot ??r, de van 10 ill. 5 db. ??gynevezett \"k??pes k??rd??s\" - melyek forgalmi helyzetek felismer??s??re vonatkoznak - amik 3 pontot ??rnek. ??gy ??sszesen 75 ill. 35 pont ??rhet?? el, melyb??l legal??bb 66 ill. 30 pontot kell el??rni a sikeres vizsg??hoz.")
						)
					), 

					React.createElement("div", {className: "card"}, 
						React.createElement("div", {className: "card-content"}, 
							React.createElement("span", {className: "card-title grey-text text-darken-4"}, React.createElement("h4", null, "Az alkalmaz??sr??l")), 
							React.createElement("p", null, "2015 elej??n meg??jult a KRESZ teszt, friss??tett??k a tesztanyagot, kib??v??lt a k??rd??sbank, ??s lecser??lt??k a retr?? k??peket napjaink elv??r??s??nak megfelel??re. A bevezet??s kicsit gyorsra siker??lt, ez??rt nem siker??lt a megl??v?? seg??danyagok friss??t??se. L??tva a tanul??k ??s oktat??k neh??z helyzet??t (nem lehet tudni, hogy pontosan mib??l kell felk??sz??lni, mert se up to date seg??danyagok, se a k??rd??sek nem ??llnak rendelkez??sre) a SZAKOE (Szakoktat??k Orsz??gos ??rdekk??pviseleti Egyes??lete) megegyezett a vizsgak??rd??sek tulajdonos??val, hogy tegye el??rhet??v?? a k??rd??seket teszt form??ban. Ez igen hasznosnak bizonyult, azonban a kialak??tott fel??letre t??bb negat??v visszajelz??s ??rkezett: ism??tl??d?? k??rd??sek, neh??zkes haszn??lat, nem lehet egy k??rd??st 60 m??sodpercn??l tov??bb n??zni (gyakorl??s c??lj??b??l sem), nem el??rhet?? mobilr??l (csak flash-sel rendelkez?? eszk??zr??l), egyes esetekben nem m??k??dik stb."), 
							React.createElement("br", null), 
							React.createElement("p", null, "Magam is hasonl??kkal szembes??ltem, ez??rt a felk??sz??l??semhez elk??sz??tettem ezt a programot, ami a fenti hib??kat pr??b??lja orvosolni. Ugyanabb??l az adatb??zisb??l dolgozik, ez??rt elvileg az ??sszes KRESZ vizsg??n el??fordul?? k??rd??s megtal??lhat?? benne. A fel??let ??gy lett kialak??tva, hogy min??l jobban seg??tse a felk??sz??l??st a tesztre: a tud??s felm??r??s??t, a teljes k??rd??sbank megismer??s??t, a hib??s v??laszokb??l val?? tanul??st. Az alkalmaz??s HTML alap??, ??gy mobilon is j??l haszn??lhat??. A program k??t m??ddal rendelkezik."), 
							React.createElement("br", null), 
							React.createElement("p", null, "Az els?? a teljese k??rd??sbank megtekint??se. Erre kattintva az adott kateg??ri??hoz kapcsol??d?? ??sszes k??rd??s megjelenik a helyes v??lasszal egy??tt. ??gy ut??na lehet n??zni egyes t??mak??r??knek, amit ez ember m??g kev??sb?? saj??t??tott el."), 
							React.createElement("br", null), 
							React.createElement("p", null, "A m??sik m??d a teszt m??d. Ekkor az alkalmaz??s - k??l??nb??z?? be??ll??t??sok alapj??n - egy k??rd??ssort ??ll??t ??ssze, amit meg kell v??laszolni. Alap be??ll??t??s sor??n el??t??rbe helyez??dnek az ??j k??rd??sek (hogy min??l t??bb k??rd??st megismerj??nk) illetve a rontott k??rd??sek (seg??ti memoriz??lni a helyes v??laszt). Az egyes k??rd??sek mellett mindig megjelenik egy csillag gomb, amivel a fontosabb/nehezebb k??rd??seket meg lehet jel??lni. A k??rd??ssor ??ssze??ll??t??s??n??l ezek is priorit??st ??lveznek, ??s k??l??n is el?? lehet h??vni ??ket. Minden k??rd??s megv??laszol??s??ra 60 m??sodperc ??ll rendelkez??sre, azonban a program - ellent??tben a vizsgaszoftverrel - ennek lej??rta ut??n nem l??ptet tov??bb a k??vetkez?? k??rd??sre. Ez a gyakorl??st szolg??lja. A v??lasz megjel??l??se ut??n r??gt??n l??that??v?? v??lik a helyes megold??s - ??gy r??gt??n l??that?? a hib??s v??lasz, ??s memoriz??lni lehet a helyeset.")
						)
					), 

					React.createElement("div", {className: "card"}, 
						React.createElement("div", {className: "card-content"}, 
							React.createElement("span", {className: "card-title grey-text text-darken-4"}, React.createElement("h4", null, "Javasolt tanul??si m??dszer")), 
							React.createElement("p", null, "Az al??bbiakban a saj??t KRESZ vizsg??mhoz haszn??lt m??dszert ??rom le, mellyel hib??tlan eredm??nyt ??rtem el."), 
							React.createElement("ol", null, 
								React.createElement("li", null, "A sikeres KRESZ vizsga legjobb garanci??ja a pontos tud??s, melyet a legk??nnyebben a KRESZ tanfolyamon val?? odafigyel??ssel lehet elsaj??t??tani. Tapasztalatb??l mondom, hogy ??rdemes odafigyelni, mert egyr??szt ??gy lehet a leggyorsabban elsaj??t??tani a sz??ks??ges tud??st, m??sr??szt a megszerzett ismeretek egy eg??sz ??letre j?? alapot jelentenek."), 

								React.createElement("li", null, "A KRESZ tanfolyam k??zben ??s ut??n ??rdemes p??r (vagy t??bb :) ) KRESZ teszt megold??s??val kezdeni. Ha hib??san v??laszolsz, semmi gond, pr??b??ld meg megmoriz??lni a helyes v??laszt, majd amikor a program legk??zelebb ugyanazt a k??rd??st dobbja (ezt direkt megteszi), akkor m??r j??l tudsz v??laszolni, ??s ??gy r??gz??l a helyes megold??s. Ha egy k??rd??sre j??l v??laszolsz, de m??gis ??gy ??rzed, hogy gyakorolni k??ne m??g, akkor kattints r?? mellette a csillagra, ??gy meg tudod jel??lni."), 

								React.createElement("li", null, "Ha m??r sok tesztet megoldott??l, l??togass el a ", React.createElement("i", null, "Statisztik??k"), " f??lre. Itt l??tni fogod, hogy hogyan ??llsz az egyes t??mak??r??kkel, mi az amire ??rdemes r??fek??dni. Ha egy t??mak??r nem megy, akkor olvass/k??rdezz ut??na, illetve b??ng??szd ??t a k??rd??seit a ", React.createElement("i", null, "K??rd??sbank b??ng??sz??se"), " r??szen. Teszt form??ban is gyakorolhatod ??ket a k??rd??ssor testreszab??s??val."), 

								React.createElement("li", null, "Gyakorolj m??g t??bbet."), 

								React.createElement("li", null, "Gy??z??dj meg r??la, hogy a \"k??pes k??rd??sek\" j??l mennek. Ezek igaz??n fontosak, a teszten is 3 pontot ??rnek. Ha nem mennek, akkor els??sorban ne gyakorl??ssal pr??b??lj jav??tani, hanem n??zz ut??na, hogy pontosan milyen szab??lyok ??rv??nyesek. Csak p??r szab??ly van, de azokat pontosan kell tudni ??s alkalmazni. Mivel igen sok ilyen k??rd??s van, ez??rt az nem fog menni, hogy bemagolod a helyes v??laszokat. Viszont ha azt a p??r szab??lyt magabiztosan elsaj??t??tod, minden k??rd??st meg fogsz tudni v??laszolni."), 

								React.createElement("li", null, "Ha rendelkezel a r??gi (CD-s) KRESZ programmal, ??rdemes azt is kipr??b??lni, mert a vizsg??n tov??bbra is ugyanazt a programot haszn??lj??k, csak ??j k??rd??sekkel. Teh??t a val??s vizsga kin??zete/fel??lete/kezel??szervei megegyeznek az ott tal??lhat??val, ??gy nyugodtabban tudsz vizsg??zni, hanem ott l??tod ezeket el??sz??r."), 

								React.createElement("li", null, "A KRESZ vizsg??d napj??n, vagy el??tte egy nappal ??rdemes ??tism??telni a neh??z k??rd??seket. Ehhez menj az ??j teszt men??pontra, majd alul ??ll??tsd be, hogy 1) csak megj??lt/rontott k??rd??seket adjon 2) az ??sszes ilyen k??rd??st adja ki, ne csak t??mak??r??nk??nt egyet. ??gy az ??sszes ilyen k??rd??st ??tn??zheted, ??s memoriz??lhatod a helyes v??laszt."), 

								React.createElement("li", null, "Menj el a KRESZ vizsg??dra, j?? esetben az ??sszes k??rd??s ismer??s lesz (vagy legal??bbis hasonl??, mint amiket l??tt??l), ??s hib??tlanul ??tm??sz. :)")
							), 
							React.createElement("p", null, "Sok sikert! :)")
						)
					), 

					React.createElement("div", {className: "card"}, 
						React.createElement("div", {className: "card-content"}, 
							React.createElement("span", {className: "card-title grey-text text-darken-4"}, React.createElement("h4", null, "Visszajelz??s")), 
							React.createElement("p", null, "Minden visszajelz??st sz??vesen v??rok a ", React.createElement("strong", null, "ujkreszteszt (a) gmail.com"), " c??men. Ha k??rd??sed, javaslatod vagy ??tleted van, esetleg hib??t tal??lt??l, ??rj hogy min??l jobb lehessen a program. Ha tetszett az alkalmaz??s, oszd meg m??sokkal is.")
						)
					)
				)
			);
		}
	});

	var Tester = React.createClass({displayName: 'Tester',
		getInitialState: function() {
			return {
				category: null,
				page: 'loading',
			};
		},
		componentDidMount: function() {
			var self = this;

			model.getCategory(this.props.categoryId)
			.done(function(category) {
				self.setState({
					category: category,
					page: 'generator',
				});
			})
			.fail(function() {
				alert('Failed to load category information!');
			});
		},
		startTest: function(settings, groups) {
			this.setState({page: 'loading'});

			var test = model.generateTest(this.state.category, settings, groups);

			this.setState({
				page: 'test',
				test: test,
				settings: settings,
				groups: groups
			});

			if (ga) { ga('send', 'event', 'test', 'start-test', this.state.category.id + ' '); }
		},
		startNew: function(changeSettings) {
			if (changeSettings) {
				this.setState({page: 'generator'});
			} else {
				this.startTest(this.state.settings, this.state.groups);
			}
		},
		showResult: function() {
			this.setState({
				page: 'result',
			});

			if (ga) { ga('send', 'event', 'test', 'end-test', this.state.category.id); }
		},
		render: function() {
			if (this.state.page == 'loading') {
				return React.createElement(Loading, null);
			} else if (this.state.page == 'generator') {
				return React.createElement(TestGenerator, {category: this.state.category, startTestCallback: this.startTest, settings: this.state.settings, groups: this.state.groups});
			} else if (this.state.page == 'test') {
				return React.createElement(Test, {category: this.state.category, settings: this.state.settings, test: this.state.test, showResultCallback: this.showResult});
			} else if (this.state.page == 'result') {
				return React.createElement(TestResult, {category: this.state.category, settings: this.state.settings, test: this.state.test, startNewCallback: this.startNew});
			}
		}
	});

	var TestGenerator = React.createClass({displayName: 'TestGenerator',
		settings: {
			'filter': {label: 'K??rd??sek', value: 'all', type: 'radio', options: {
				'all': 'B??rmilyen k??rd??s',
				'new-only': 'Csak ??j k??rd??sek',
				'missed-only': 'Csak rontott k??rd??sek',
				'marked-only': 'Csak megjel??lt k??rd??sek',
				'missed-marked': 'Csak megjel??lt/rontott k??rd??sek',
				'missed-marked-new': 'Csak megjel??lt/rontott/??j k??rd??sek'
			}},
			'order': {label: 'Sorrend', value: 'category', type: 'radio', options: {
				'category': 'Rendez??s t??mak??r??nk??nt',
				'random': 'Rendez??s v??letlenszer??en'
			}},
			'count': {label: 'K??rd??sek sz??ma', value: 'original', type: 'radio', options: {
				'original': 'Teszt szerinti k??rd??ssz??m',
				'fixed10': 'Legfeljebb 10 k??rd??s t??mak??r??nk??nt',
				'all': '??sszes k??rd??s'
			}},
			'prioritize': {label: 'Megjel??lt/rontott/??j k??rd??sek prioritiz??l??sa', value: true, type: 'checkbox'},
			'showTime': {label: 'Id?? m??r??se', value: true, type: 'checkbox'},
			'limitTime': {label: 'Id?? letelte ut??n automatikus tov??bbl??p??s', value: false, type: 'checkbox'},
			'onepage': {label: '??sszes k??rd??s mutat??sa egyszerre', value: false, type: 'checkbox'},
			'instantCorrection': {label: 'Helyes v??lasz azonnali mutat??sa', value: true, type: 'checkbox'},
			'showHistory': {label: 'K??rd??sek alatt kor??bbi helyes v??lasz statisztika mutat??sa', value: true, type: 'checkbox'}
		},
		getInitialState: function() {
			return {
				settings: this.props.settings ? this.props.settings : this.getDefaultSettings(),
				groups: this.props.groups ? this.props.groups : this.getUniformGroupSelection(true)
			};
		},
		getUniformGroupSelection: function(value) {
			var groupsSelected = {};
			for (var key in this.props.category.groups) {
				groupsSelected[this.props.category.groups[key].id] = value;
			}
			return groupsSelected;
		},
		getDefaultSettings: function() {
			var settingValues = {};
			for (var key in this.settings) {
				settingValues[key] = this.settings[key].value;
			}
			return settingValues;
		},
		startTest: function() {
			this.props.startTestCallback(this.state.settings, this.state.groups);
		},
		startRealTest: function() {
			this.props.startTestCallback(this.getDefaultSettings(), this.getUniformGroupSelection(true));
		},
		toggleGroup: function(groupId) {
			var groups = this.state.groups;
			groups[groupId] = !groups[groupId];
			this.setState({groups: groups});
		},
		resetGroupSelection: function(value) {
			this.setState({groups: this.getUniformGroupSelection(value)});
		},
		onChangeSetting: function(event) {
			var settings = this.state.settings;
			settings[event.target.name] = event.target.type == 'checkbox' ? event.target.checked : event.target.value;
			this.setState({settings: settings});
		},
		render: function () {
			var self = this;
			var category = this.props.category;

			var groupsHtml = category.groups.map(function(group) {
				return (
					React.createElement("p", {key: group.id}, 
						React.createElement("input", {type: "checkbox", checked: self.state.groups[group.id], id: 'group-cb-' + group.id, onChange: self.toggleGroup.bind(self, group.id)}), 
						React.createElement("label", {htmlFor: 'group-cb-' + group.id}, group.title)
					)
				);
			});

			var settingsHtml = $.map(this.settings, function(setting, key) {
				if (setting.type == 'checkbox') {
					return (
						React.createElement("p", {key: key}, 
							React.createElement("input", {type: "checkbox", checked: self.state.settings[key], id: 'setting-cb-' + key, name: key, className: "filled-in", onChange: self.onChangeSetting}), 
							React.createElement("label", {htmlFor: 'setting-cb-' + key}, setting.label)
						)
					);
				} else if (setting.type == 'radio') {
					var radios = $.map(setting.options, function(option, optionKey) {
						var id = 'setting-radio-' + key + '-' + optionKey;
						return (
							React.createElement("p", {className: "radio-inline", key: optionKey}, 
								React.createElement("input", {type: "radio", checked: optionKey == self.state.settings[key], name: key, value: optionKey, onChange: self.onChangeSetting, id: id}), 
								React.createElement("label", {htmlFor: id}, option)
							)
						);
					});
					return React.createElement("div", {key: key, className: "radio-container"}, React.createElement("strong", {className: "radio-label"}, setting.label), " ", radios);
				}
			});

			return (
				React.createElement("div", null, 
					React.createElement("h3", null, category.title), 
					React.createElement("div", {className: "card"}, 
						React.createElement("div", {className: "card-content"}, 
							React.createElement("span", {className: "card-title grey-text text-darken-4"}, "Val??s teszt"), 
							React.createElement("p", null, "Val??s teszt ind??t??sa, a vizsg??n megszokott sz??m?? k??rd??ssel, pontoz??ssal, id??limittel; a k??rd??sek random v??laszt??s??val."), 
							React.createElement("p", null, "Haszn??ld ezt, ha nem akarod testreszabni a k??rd??ssort.")
						), 
						React.createElement("div", {className: "card-action"}, 
							React.createElement("a", {onClick: this.startRealTest}, "Val??s teszt ind??t??sa")
						)
					), 
					React.createElement("div", {className: "card"}, 
						React.createElement("div", {className: "card-content"}, 
							React.createElement("span", {className: "card-title grey-text text-darken-4"}, "T??mak??r??k kiv??laszt??sa"), 
							groupsHtml
						), 
						React.createElement("div", {className: "card-action"}, 
							React.createElement("a", {onClick: this.resetGroupSelection.bind(this, true)}, React.createElement("i", {className: "material-icons tiny hide"}, "done_all"), " ??sszes kiv??laszt??sa"), 
							React.createElement("a", {onClick: this.resetGroupSelection.bind(this, false)}, React.createElement("i", {className: "material-icons clear hide"}, "done_all"), " Kiv??laszt??s t??rl??se")
						)
					), 
					React.createElement("div", {className: "card"}, 
						React.createElement("div", {className: "card-content"}, 
							React.createElement("span", {className: "card-title grey-text text-darken-4"}, "Be??ll??t??sok"), 
							settingsHtml
						)
					), 	
					React.createElement("a", {className: "waves-effect waves-light btn", onClick: this.startTest}, "Teszt ind??t??sa")
				)
			);
		}
	});

	var Test = React.createClass({displayName: 'Test',
		getInitialState: function() {
			return {
				qNum: 0,
				startTime: new Date()
			};
		},
		nextQuestion: function() {
			if (this.state.qNum + 1 >= this.props.test.getQuestionCount()) {
				return this.finishTest();
			}

			this.setState({qNum: this.state.qNum + 1});

			if (ga) { ga('send', 'event', 'test', 'next-question', this.props.category.id); }
		},
		finishTest: function() {
			this.props.showResultCallback();
		},
		render: function() {
			var self = this;
			var question = this.props.test.questions[this.state.qNum];

			var questionHtml = !this.props.settings.onepage ?
				(React.createElement(Question, {question: question, settings: this.props.settings, nextQuestionCallback: this.nextQuestion, type: "test"})) :
				$.map(this.props.test.questions, function(question) {
					return React.createElement(Question, {question: question, settings: self.props.settings, nextQuestionCallback: $.noop, type: "test", key: question.id})
				});

			var buttonsHtml = this.props.settings.onepage ?
				React.createElement("a", {className: "waves-effect waves-light btn", title: "Mutasd az eredm??nyt!", onClick: this.finishTest}, "Teszt befejez??se") :
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "col m4 s12"}, React.createElement("a", {className: "waves-effect waves-light btn", onClick: this.nextQuestion}, "K??vetkez?? k??rd??s")), 
					React.createElement("div", {className: "test-progress-question-count col m4 s12"}, this.state.qNum + 1, " / ", this.props.test.getQuestionCount()), 
					React.createElement("div", {className: "col m4 s12"}, React.createElement("a", {className: "waves-effect waves-teal btn-flat right", title: "Mutasd az eredm??nyt!", onClick: this.finishTest}, "Teszt befejez??se"))
				)
				;

			return (
				React.createElement("div", null, 
					React.createElement("h3", null, this.props.category.title), 
					questionHtml, 
					buttonsHtml
				)
			);
		}
	});

	var TestResult = React.createClass({displayName: 'TestResult',
		startNew: function(changeSettings) {
			this.props.startNewCallback(changeSettings);
		},
		render: function() {
			var self = this;

			// Use custom settings on the result page
			var settings = $.extend({}, self.props.settings);
			settings.showHistory = true;

			var questionsHtml = $.map(this.props.test.questions, function(question) {
				return React.createElement(Question, {question: question, settings: settings, type: "result", key: question.id})
			});

			return (
				React.createElement("div", null, 
					React.createElement("h3", null, this.props.category.title), 
					React.createElement("p", null, React.createElement("strong", null, "Eredm??ny:??", 
						this.props.test.getTotalScore(), " / ", this.props.test.getMaxScore(), " pont (", this.props.test.getPercentage(), "%) ???????", 
						this.props.test.getCorrectAnswers(), " / ", this.props.test.getQuestionCount(), " k??rd??s ???????", 
						this.props.test.isPassed() ? React.createElement("span", {className: "green-text text-darken-3"}, "??tment") : React.createElement("span", {className: "red-text text-darken-3"}, "Nem siker??lt")
					)), 
					questionsHtml, 
					React.createElement("div", {className: "row"}, 
						React.createElement("div", {className: "col m6 s12 center-align"}, React.createElement("a", {className: "waves-effect waves-light btn", onClick: this.startNew.bind(this, false)}, "??j teszt azonos be??ll??t??sokkal")), 
						React.createElement("div", {className: "col m6 s12 center-align"}, React.createElement("a", {className: "waves-effect waves-light btn", onClick: this.startNew.bind(this, true)}, "??j teszt m??s be??ll??t??sokkal"))
					)
				)
			);
		}
	});

	var Question = React.createClass({displayName: 'Question',
		getInitialState: function () {
			return {
				showAnswers: false,
				startTime: (new Date).getTime(),
				timer: null
			};
		},
		selectChoice: function(event) {
			if (this.props.question.selected === null && this.props.type == 'test') {
				this.props.question.selectChoice(parseInt(event.target.value));

				if (this.props.settings.instantCorrection) {
					this.stopTimeUpdate();
				}

				this.forceUpdate();

				if (ga) { ga('send', 'event', 'test', 'answer-question', this.props.question.group.category.id); }
			}
		},
		toggleMark: function() {
			this.props.question.setMarked(!this.props.question.isMarked());
			this.forceUpdate();
		},
		getElapsedTime: function() {
			return this.props.type == 'test' ? Math.round(((new Date).getTime() - this.state.startTime + this.props.question.elapsedTime) / 1000) : this.props.question.elapsedTime;
		},
		getRemainingTime: function() {
			return this.props.question.group.category.exTimeLimit - this.getElapsedTime();
		},
		getTimeState: function(remainingTime) {
			if (remainingTime > 10) {
				return 'ok';
			} else if (remainingTime >= 0) {
				return 'warn';
			} else {
				return 'expired';
			}
		},
		updateTime: function(remainingTime) {
			var sign = remainingTime >= 0 ? '' : '-';
			calcRemainingTime = Math.abs(remainingTime);
			var seconds = calcRemainingTime % 60;
			var minutes =  (calcRemainingTime - seconds) / 60;
			var html = '<span class="question-time-val question-time-val-' + this.getTimeState(remainingTime) + '">' + sign + minutes + ':' + (seconds < 10 ? '0' : '') + seconds + '</span>';
			$(React.findDOMNode(this.refs.time)).html(html);
		},
		startTimeUpdate: function() {
			var self = this;

			this.setState({
				startTime: (new Date).getTime(),
				timeCallback: setInterval(function() {
					var remainingTime = self.getRemainingTime();
					if (remainingTime < 0 && self.props.settings.limitTime) {
						self.nextQuestion();
					} else {
						self.updateTime(remainingTime);
					}
				}, 1000)
			});
		},
		stopTimeUpdate: function() {
			if (this.state.timeCallback) {
				clearInterval(this.state.timeCallback);
				this.props.question.elapsedTime = this.getElapsedTime();
				this.setState({timeCallback: null});
			}
		},
		componentWillMount: function() {
			if (this.props.settings.showTime && this.props.type == 'test') {
				this.startTimeUpdate();
			}
		},
		componentWillReceiveProps: function(newProps) {
			if (newProps.settings.showTime && this.props.type == 'test') {
				this.startTimeUpdate();
			}
		},
		componentDidMount: function() {
			if (this.props.settings.showTime) {
				this.updateTime(this.getRemainingTime());
			}
		},
		componentWillUnmount: function() {
			this.stopTimeUpdate();
		},
		componentDidUpdate: function() {
			if (this.props.settings.showTime) {
				this.updateTime(this.getRemainingTime())
			}
		},
		nextQuestion: function() {
			this.props.nextQuestionCallback();
		},
		render: function() {
			var self = this;
			var question = this.props.question;

			var selected = question.selected !== null;
			var choicesHtml = $.map(question.choices, function(choice, i) {
				var id = 'question-answer-' + self.props.question.id + '-' + i;
				return (
					React.createElement("p", {key: i, className: question.correct == i ? 'choice-right' : 'choice-wrong'}, 
						React.createElement("input", {type: "radio", checked: question.selected === i, value: i, id: id, readOnly: selected, onChange: self.selectChoice}), 
						React.createElement("label", {htmlFor: id}, choice)
					)
				);
			});

			var imageHtml = $.map(question.assets, function(asset, i) {
				return (
					React.createElement("img", {className: "question-image", src: 'data/asset/' + asset, key: i})
				);
			});

			var questionLinkHtml = (this.props.type == 'result') ?
				React.createElement("a", {target: 'category_' + question.group.category.id, href: 'tests/' + question.group.category.id + '.html#question-' + question.id, className: "teal-text right"}, React.createElement("small", null, "#", question.id)) :
				'';

			var showAnswers = (this.props.type == 'result') || (selected && this.props.settings.instantCorrection) || this.state.showAnswers;
			return (
				React.createElement("div", {className: 'card ' + (showAnswers ? ' show-answers' : '') + (selected ? ' decided' : ' undecided') + (showAnswers && selected ? (this.props.question.isCorrect() ? ' question-right green lighten-5' : ' question-wrong red lighten-5') : '')}, 
					React.createElement("div", {className: "card-content question-content"}, 
						imageHtml, 
						React.createElement("div", {className: "question-main"}, 
							React.createElement("p", {className: "question-text"}, 
								question.question, "??", 
								questionLinkHtml
							), 
							choicesHtml
						)
					), 

					React.createElement("div", {className: "card-action row question-footer"}, 
						React.createElement("div", {className: "col s4"}, 
							React.createElement("strong", null, "T??mak??r:"), " ", question.group.title
						), 
						React.createElement("div", {className: 'col ' + (this.props.settings.showHistory ? '' : 'hide ') + (this.props.settings.showTime ? 's2' : 's4') + ' question-score'}, 
							React.createElement("span", {className: "green-text text-darken-3", title: "Helyes v??laszok sz??ma"}, question.getCorrectCount()), "???????", 
							React.createElement("span", {className: "red-text text-darken-3", title: "Hib??s v??laszok sz??ma"}, question.getMissedCount())
						), 
						React.createElement("div", {className: 'col question-time ' + (this.props.settings.showTime ? '' : 'hide ') + (this.props.settings.showHistory ? 's2' : 's4'), title: "H??tra l??v?? id??", ref: "time"}
						), 
						React.createElement("div", {className: 'col ' + (!this.props.settings.showHistory && !this.props.settings.showTime ? 's8' : 's4')}, 
							React.createElement("a", {className: 'question-mark right btn-floating waves-effect waves-light teal ' + (question.isMarked() ? '' : 'lighten-3'), onClick: this.toggleMark, title: "K??rd??s megjel??l??se k??s??bbi el??h??vhat??s??g c??lj??b??l"}, 
								React.createElement("i", {className: "material-icons small"}, "star")
							)
						)
					)
				)
			);
		}
	});

	var Loading = React.createClass({displayName: 'Loading',
		render: function () {
			return (
				React.createElement("div", {className: "progress"}, 
					React.createElement("div", {className: "indeterminate"})
				)
			);
		}
	});

	var Statistics = React.createClass({displayName: 'Statistics',
		getInitialState: function() {
			return {
				data: []
			};
		},
		componentDidMount: function() {
			var self = this;

			model.getStatistics().done(function(data) {
				if (self.isMounted()) {
					self.setState({data: data});
				}
			});
		},
		render: function() {
			var self = this;

			var categoriesHtml = $.map(this.state.data, function(row) {
				var groupsHtml = $.map(row.groups, function(entry) {
					return (
						React.createElement("tr", null, 
							React.createElement("td", {className: "statistics-group-title"}, entry.group.title), 
							React.createElement("td", null, entry.group.count, " k??rd??s, ", entry.group.score, " pont"), 
							React.createElement("td", null, entry.group.questions.length), 
							React.createElement("td", null, entry.answered), 
							React.createElement("td", null, entry.right), 
							React.createElement("td", null, entry.wrong)
						)
					);
				});

				return (
					React.createElement("div", {className: "card"}, 
						React.createElement("div", {className: "card-content"}, 
							React.createElement("span", {className: "card-title grey-text text-darken-4"}, row.category.title), 
							React.createElement("table", {className: "centered responsive-table"}, 
								React.createElement("thead", null, 
									React.createElement("tr", null, 
										React.createElement("th", null, "T??mak??r"), 
										React.createElement("th", null), 
										React.createElement("th", null, "K??rd??sek sz??ma"), 
										React.createElement("th", null, "Megv??laszolt k??rd??sek"), 
										React.createElement("th", {title: "Legal??bb egyszer helyesen megv??laszolt k??rd??sek sz??ma"}, "Helyes v??laszok"), 
										React.createElement("th", {title: "Legal??bb egyszer rosszul megv??laszolt k??rd??sek sz??ma"}, "Rossz v??laszok")
									)
								), 
								React.createElement("tbody", null, 
									groupsHtml
								)
							)
						)
					)
				);
			});

			return (
				React.createElement("div", null, 
					React.createElement("h3", null, "Statisztika"), 
					categoriesHtml
				)
			);
		}
	});

	// http://coenraets.org/blog/2014/12/animated-page-transitions-with-react-js/
