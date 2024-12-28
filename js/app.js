/*--------- configurations ---------*/
url_interface = 'https://quran.ksu.edu.sa/ayat/interface.php?ui=app';
base_mp3url = 'https://quran.ksu.edu.sa/ayat/mp3';
res_url = 'https://quran.ksu.edu.sa/ayat/resources';
res_ext = 'ayt';
masahef = {
	"hafs" : {
		url : "https://quran.ksu.edu.sa/safahat/png_big/",
		folder : "hafs",
		ext : "png",
		page_key : "Page",
		whr : 1.474, // width height ratio
		height : 690,
		factor : 0.2 // frame factor
	},
	"tajweed" : {
		url : "https://quran.ksu.edu.sa/tajweed_png/",
		folder : "tajweed",
		ext : "png",
		page_key : "Page2",
		whr : 1.546, // width height ratio
		height : 720,
		factor : 0.10 // frame factor
	},
	"warsh" : {
		url : "https://quran.ksu.edu.sa/warsh/",
		folder : "warsh",
		ext : "png",
		page_key : "Page_warsh",
		whr : 1.62, // width height ratio
		height : 760,
		factor : 0.13 // frame factor
	}
}
progress_factor = 1; // neglected, used in old versions.

var downloads = [], missingNoted = {}, activeDowns = 0, didNoMed = [], didDir = [], _afs = false, _uri = '', _urid = '', _extFS = false, _extURI = false, pendDL = [], hasExtSt = false, hasPrevAyt = false, dlCBS = [];

SG = ( typeof SG == "undefined") ? {} : SG; // the SG container
// declaring the notofier object with empty functions
SG.Notifier = {
    add: function(obj,cb){

    },
    cancel: function(id,cb){

    },
    cancelAll: function(cb){

    },
    onclick: function(){
    },
    oncancel: function(){
    }
};

/*-------- Context Start --------*/
(function(window, $) {
    var _first_img_loaded = false, durationStopped=false;
    
    // boot handler
    SG.boot = function(cb) {
		document.addEventListener("deviceready", function() {
            
			if (!( _id = getKey('id'))) {
				_id = rand(1, 100000000);
				setKey('id', _id);
			}
			url_interface += '&ver=' + _ver + '&platform='+_platform_;

			SG.Initer.currAya = getKey('curr_aya') || null;
			SG.Initer.currLang = getKey('lang') || null;
			SG.Initer.currTrans = getKey('trans') || null;
			SG.Initer.currTafsir = getKey('tafsir') || null;
			SG.Initer.currMosshaf = getKey('mosshaf') || null;
			SG.Initer.currQaree = getKey('curr_qaree') || null;
			SG.Initer.currZoom = getKey('curr_zoom') || null;
			SG.Initer.currTFS = getKey('curr_tfs') || null; // TFS: translation font size


		    
			if (!getKey("new_intro")) {

				_FR_ = true;

				var l_str = '<div id="f_lang_sel">';
				l_str += '<button id="flang_ar" style="height:30px">' + parseAr('عربى',true) + '</button>';
				l_str += '<button id="flang_en" style="height:30px">English</button>';
				l_str += '</div>';
				//////
				var a = alertt(l_str, 'اللغة | Language', _emp, {"persist":true});
				a.height(110);
				a.hideBu();
				$("#f_lang_sel button").on(END_EV, function() {

					SG.switchLang($(this).attr('id').split('_')[1]);
					try{
						a.tm();
					}
					catch(e){};
										
					//alert(_lang['storage_permission'])
					window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
						fs.root.getDirectory("Ayat", { create: true, exclusive: false }, function(){
							//fs.root.getFile("Ayat/permission.txt", { create: true, exclusive: false }, function (fileEntry) {
								SG.Plugins.INITP.check(function(eP) {
									//a0.tm();
									setKey('ver', _ver);
			
									setKey("new_intro", 1);
			
			
									var recPath = eP;
									if (recPath.substr(recPath.length - 1) == "/") {
										recPath = recPath.substr(0, recPath.length - 1);
									}
									if (recPath.indexOf("://") == -1) {
										recPath = "file://" + recPath;
									}
									//alert("recPath:"+recPath);
									
									window.resolveLocalFileSystemURL(recPath, function(d) {
										_afs = d;
										_uri = recPath;
										//fPrep();
										_urid = _uri + '/' + 'Ayat';
										//alert("urid:"+_urid);
										cb();
			
										setTimeout(function() {
											if (SG.ToolsMenu.getState() === null) {
												SG.ToolsMenu.toggle(1);
												setTimeout(function() {
													SG.ToolsMenu.toggle(-1);
												}, 6000);
											}
										}, 9000);
										
									}, function(e) {
										alert("Error: please check that external storage is available \n خطأ: فضلا تأكد أن مساحة التخزين الخارجية متوفرة");
										navigator.app.exitApp();						
									});
									
									
			
								}, function(e) {
									alert("Error: please check that external storage is available \n خطأ: فضلا تأكد أن مساحة التخزين الخارجية متوفرة");
									navigator.app.exitApp();
								}, "1");
							//}, function(){alert("Error access storage, please give Ayat the storage permission")});
	
						}, function(){
							alert("Error access storage, please give Ayat the storage permission")
						});
						
			
					}, function(){
						alert("Internal Error");

					});					
					
					

				});
			}
			else{
				var fr = "0";
				if (getKey('ver') != _ver) {
					setKey('ver', _ver);
					fr = "1";
				}
				SG.Plugins.INITP.check(function(eP) {//
					
					var recPath = eP;
					if (recPath.substr(recPath.length - 1) == "/") {
						recPath = recPath.substr(0, recPath.length - 1);
					}
					if (recPath.indexOf("://") == -1) {
						recPath = "file://" + recPath;
					}
	
					window.resolveLocalFileSystemURL(recPath, function(d) {
						_afs = d;
						_uri = recPath;
						//fPrep();
						_urid = _uri + '/' + 'Ayat';                            
						cb();
	
						setTimeout(function() {
							if (SG.ToolsMenu.getState() === null) {
								SG.ToolsMenu.toggle(1);
								setTimeout(function() {
									SG.ToolsMenu.toggle(-1);
								}, 6000);
							}
						}, 9000);
	
					}, function(e) {
						alert("Error: please check that external storage is available \n خطأ: فضلا تأكد أن مساحة التخزين الخارجية متوفرة");
						navigator.app.exitApp();						
					});                
					
				}, function(e) {
					alert("Error: please check that external storage is available \n خطأ: فضلا تأكد أن مساحة التخزين الخارجية متوفرة");
					navigator.app.exitApp();
				}, fr);				
			}


		}, false);

	}
    // initalize the file system
	function initFS(cb,cbf) {
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {

			_afs = fs.root;
			//fPrep();
			_uri = (true || _platform_ == "android")?_afs.toURL():_afs.toInternalURL();
			if (_uri.substr(_uri.length - 1) == "/") {
				_uri = _uri.substr(0, _uri.length - 1);
			}
			_urid = _uri + '/' + 'Ayat';
			cb.call();

		}, cbf);

	}

    // method for downloading files from the server
	SG.loadFile = function(_fs, url, local, check, cb, cbf, cbp) {
		var _this = this;
		var localAlt = false; // local alternative distenation

		if (local.indexOf('|') != -1) {
			localAlt = local.split('|')[1];
			local = local.split('|')[0];
		}
        // stop handler
		this.stop = function() {//
			try {
				this.ft.abort(_emp, _emp);
				//
			} catch (e) {
			}

			setTimeout(function() {
				_fs.getFile(_relter(local), {
					create : false
				}, function(f) {
					f.remove();
				}, _emp);
			}, 300);

		}
        // dlCBS is downloading callbacks array, for preventing downloading the same file in parallel
		if (dlCBS[local]) {
			dlCBS[local].push(cb);
			return;
		}

		if (!dlCBS[local])
			dlCBS[local] = [];

		if (!check && !localAlt) {
			getF();
		} else {
			_fs.getFile(_relter(local), {
				create : false
			}, function(fl) {
				if (!dlCBS[local]) {
					dlCBS[local] = [];
				}
				dlCBS[local].push(cb);
				for (var i = 0; i < dlCBS[local].length; i++) {
					dlCBS[local][i]();
				}

				dlCBS[local] = undefined;

			}, function() {
				if (localAlt) {
					_fs.getFile(_relter(localAlt), {
						create : false
					}, function(fE) {
						var dpath = local.split('/');
						var fname = dpath.pop();
						dpath = dpath.join('/');
						_fs.getDirectory(_relter(dpath), {
							create : true
						}, function(dE) {
							fE.moveTo(dE, fname, function() {
								cb()
							}, getF);
						});
					}, getF);
				} else {
					getF();
				}

			});
		}

		function getF() {

			if (!dlCBS[local])
				dlCBS[local] = [];

			dlCBS[local].push(cb);

			var cbi = function() {
				try {
					for (var i = 0; i < dlCBS[local].length; i++) {
						dlCBS[local][i]("downloaded");
					}
				} catch (e) {
				}
				dlCBS[local] = undefined;
				remPendDL(local);
				savePendDL();

			}
			var cbf2 = function() {
				setTimeout(function() {
					_fs.getFile(_relter(local), {
						create : false
					}, function(fE) {
						fE.remove(_emp, _emp);
					}, function() {
					});
				}, 500);

				dlCBS[local] = undefined;
				cbf();
				remPendDL(local);
				savePendDL();
			}

			pendDL.push(local);
			savePendDL();

			_this.ft = new FileTransfer();

			if (cbp) {
			    _this.ft.onprogress = function (PE) {
					if (PE.lengthComputable) {
						cbp(PE.loaded, PE.total);
					}
				}
			}
			_this.ft.download(url, local, cbi, cbf2);
		}

	}
    


	SG.Initer.postHook = function () {
        $(".popup").on("hide", function(){
            window.scrollTo(0,0);
        });

	    SG.Menu.setIniter('sm_downloadImages', function (first) {

	        if (first) {
	            SG.Trig.on('langChange', function () {
	                $("#m_masahef").html(build_selMasahef(currMosshaf)).change();
	            });

	            $("#m_pages_from").html(build_selPages(1, 1)).change();
	            $("#m_pages_to").html(build_selPages(604, 1)).change();

	            $("#m_masahef").html(build_selMasahef(currMosshaf)).change();

	            $("#m_pages_from").change(function () {
	                var from = $("#m_pages_from").val();
	                $("#m_pages_to").html(build_selPages(604, from));
	                $("#m_pages_to").change();
	            });

	            $("#bu_m_pages").on("tapone" + END_BOUND, function (e) {
	                var $obj = $(this);
	                if (!$obj.data('title')) $obj.data('title', $obj.html());
	                else if ($obj.data('title') != $obj.html()) {
	                    return;
	                }
	                var title = $obj.data('title');

	                $obj.html('<img src="images/loading_micro.gif" style="border:none">');
                    setTimeout(function(){
                        SG.download_startImages(function () {
                            $obj.html(title);
                            SG.Naver.get('sm_downloadImages').scrollTo(0, 0, 0);
                            setTimeout(function () {
                                SG.Naver.refresh('sm_downloadImages');
                            }, 600);

                        });
                    }, 700);
	            });

	            SG.Naver.attach('sm_downloadImages', 'defaultSet', 300);
	        }
	        else {
	            $("#m_masahef").val(currMosshaf).change();
	        }

	    });

	    SG.Menu.setIniter('sm_downloadAudio', function (first) {
	        if (first) {

	            SG.Trig.on('langChange', function () {
	                $("#m_quraa").html(build_selQuraa(currQaree)).change();
                    $("#m_sel_begin_sura").html(build_selSowar(currAya.split('_')[0])).change();

                });

                /*
	            $("#m_sowar_from").change(function () {
	                var b_sura = $(this).val() || 1;
	                var e_sura = $("#m_sowar_to").val();

	                $("#m_ayat_from").html(build_selAyat(QuranData.Sura[b_sura][1]));

	                $("#m_sowar_to").html(build_selSowar(e_sura, b_sura));

	                $("#m_ayat_from").change();
	                $("#m_sowar_to").change();


	            });
	            $("#m_ayat_from").change(function () {
	                var b_sura = $("#m_sowar_from").val();
	                var e_sura = $("#m_sowar_to").val();
	                var b_aya = $(this).val();
	                var e_aya = $("#m_ayat_to").val();
	                if (b_sura == e_sura) {
	                    $("#m_ayat_to").html(build_selAyat(QuranData.Sura[e_sura][1], e_aya, b_aya));
	                    $("#m_ayat_to").change();
	                }
	            });
	            $("#m_sowar_to").change(function () {
	                var b_sura = $("#m_sowar_from").val();
	                var e_sura = $(this).val();
	                var start = 1;
	                var seld = QuranData.Sura[e_sura][1];

	                if (b_sura <= e_sura) {
	                    start = $("#m_ayat_from").val();
	                    seld = $("#m_ayat_to").val();
	                }

	                $("#m_ayat_to").html(build_selAyat(QuranData.Sura[e_sura][1], seld, start));
	                $("#m_ayat_to").change();
	            });


	            $("#m_quraa").html(build_selQuraa(currQaree)).change();

	            $("#m_sowar_from").html(build_selSowar(1)).change();
	            $("#m_ayat_from").val(1).change();

	            $("#m_sowar_to").val(114).change();

	            $("#m_ayat_to").val(6).change();
                */
	            $("#m_quraa").html(build_selQuraa(currQaree)).change();
                
                initCombinedSels();
                
                $("#m_sel_begin_sura").html(build_selSowar(1)).change();
                $("#m_sel_begin_aya").val(1).change();

                $("#m_sel_end_sura").val(114).change();
	            $("#m_sel_end_aya").val(6).change();
                

	            $("#bu_m_audio").on("tapone" + END_BOUND, function (e) {
	                var $obj = $(this);
	                if (!$obj.data('title')) $obj.data('title', $obj.html());
	                else if ($obj.data('title') != $obj.html()) {
	                    return;
	                }
	                var title = $obj.data('title');//

	                $obj.html('<img src="images/loading_micro.gif" style="border:none">');
	                setTimeout(function () {
	                    SG.download_startAudio(function () {
	                        $obj.html(title);
	                        SG.Naver.get('sm_downloadAudio').scrollTo(0, 0, 0);
	                        setTimeout(function () {
	                            SG.Naver.refresh('sm_downloadAudio');
	                        }, 600);
	                    });
	                }, 700);//

	            });//



	            SG.Naver.attach('sm_downloadAudio', 'defaultSet', 300);
	        }
	        else {
	            $("#m_quraa").val(currQaree).change();
	        }

	    });

	    SG.Menu.setIniter('sm_downloadTtarajem', function (first) {
	        if (first) {

	            $("#m_ttarajem").html(build_selTtarajem()).change();


	            $("#bu_m_ttarajem").on("tapone" + END_BOUND, function (e) {
	                var $obj = $(this);
	                if (!$obj.data('title')) $obj.data('title', $obj.html());
	                else if ($obj.data('title') != $obj.html()) {
	                    return;
	                }
	                var title = $obj.data('title');

	                $obj.html('<img src="images/loading_micro.gif" style="border:none">');
                    setTimeout(function(){
                        SG.download_startTtarajem(function () {
                            $obj.html(title);
                            SG.Naver.get('sm_downloadTtarajem').scrollTo(0, 0, 0);
                            setTimeout(function () {
                                SG.Naver.refresh('sm_downloadTtarajem');
                            }, 600);

                        });
                    },700);
	            });

	            SG.Naver.attach('sm_downloadTtarajem', 'defaultSet', 300);
	        }
	        else {

	        }

	    });


		$("a,button").on(START_EV+" click", function(e) {
			e.preventDefault();
			e.stopPropagation();////////
		}).on(END_EV, function(e) {////
			e.preventDefault();
			e.stopPropagation();
			if ($(this).hasClass('ext') && !$(this).hasClass('noApp')) {
				var url = this.href;
				if ($(this).hasClass('suf')) {
					url += (url.indexOf('?') == -1) ? '?' : '&';
					url += 'l=' + currLang + '&ver=' + _ver + '&pf=' + _platform_;
				}
				SG.Plugins.Tools.openurl(url, function() {
				}, function() {
				});
			}//
	
		});

		$("#contact_bu").on(END_EV, function() {
			var $obj = $(this);

			if (!$obj.data('title'))
				$obj.data('title', $obj.html());
			else if ($obj.data('title') != $obj.html()) {
				$obj.data('xhr').abort();
				$obj.html($obj.data('title'));
				return;
			}
			var title = $obj.data('title');

			$obj.html('<img src="images/loading_micro.gif" style="border:none">');
			var esm = $("#ct_esm").val();
			var email = $("#ct_email").val();
			var msg = $("#ct_msg").val();
			var hp = url_interface + '&do=feedback&l=' + currLang;

			$obj.data('xhr', $.post(hp, {
				esm : esm,
				email : email,
				msg : msg
			}));

			$obj.data('xhr').done(function(bayan) {
				$obj.html($obj.data('title'));
				var err = Number(bayan.err);
				if (err) {
					$obj.hide();
					setTimeout(function() {
						$obj.show();
					}, 3000);
					$("#ct_bayan").html(bayan.msg);
					$("#ct_bayan").fadeIn('slow').delay(2000).fadeOut('fast');
				} else {
					$obj.hide();
					setTimeout(function() {
						$obj.show();
					}, 10000);

					$("#ct_bayan").html(bayan.msg);
					$("#ct_bayan").fadeIn('slow');
				}
			});
		});

	}
	var loadedImgs = [], checkedImgs = {}, sizesImgs = {}, missingImgsNoted = false;
	SG.getImg = function(img, cid, cb, cbf) {//
		//
		var mosshaf = currMosshaf;
		var url = masahef[mosshaf]['url'];

		var fl = 'images/' + masahef[mosshaf]['folder'] + '/' + img;
		////
		if (!cb)
			cb = _emp;
		if (!cbf)
			cbf = _emp;

		var cbi = function() {
			cb(_uri + '/Ayat/' + fl, cid);//
		}
		if (loadedImgs.indexOf(fl) != -1) {////
			cbi();
			return;
		}
		
		var loadF_c = 0;
		
		loadF();
		function loadF() {
			if(loadF_c++ > 10) return;
			
			new SG.loadFile(_afs, url + img, _uri + "/Ayat" + '/' + fl, true, function(dld) {
				//setTimeout(function(){
                if(! _first_img_loaded){
                    _first_img_loaded = true;
				    cbi();
                }
                else{
                    checkImgFile(_afs, _uri + "/Ayat/images", mosshaf, img, function (ret, fE) {
                        if(ret == "Pass" || ret == "Err_conn" || ret == "Err_ajax"){
                            loadedImgs.push(fl);
                            cbi();
                            if (loadedImgs.length > 10) {//
                                loadedImgs.shift();
                            }
                        }
                        else if (ret == "Err_size") {
                            fE.remove(function(){
                                loadF();//
                            }, function(){
                                loadF();
                            });
                        }
                        else if (ret == "Err_fnf") {
                            loadF();
                        }
                    });
                }
				if (dld == "downloaded") {

					var now = Math.round(Date.now() / 1000);
					if (missingNoted[mosshaf] && (now - missingNoted[mosshaf] < 3600)) {
						return;
					}
					missingNoted[mosshaf] = now;

					setTimeout(function() {
						if (confirm(_lang['confirm_download_pages'])) {
							if (currActiveWin) {
								currActiveWin.find(".popup_close").trigger(END_EV);
							}
							SG.ToolsMenu.toggle(-1);
							SG.Menu.setAltSub('sm_downloadImages');
							SG.Menu.toggle(1);
							setTimeout(function() {
								$("#bu_m_pages").trigger("tapone");
							}, 1200);

						}
					}, 3000);
				}
			}, function() {
				if (cbf) {
					cbf();
				}
			});
		}

		//checkImgs(mosshaf);
	}
	var checkImgsBusy = false;
	var checkImgs = function(mosshaf) {

		var now = Math.round(Date.now() / 1000);
		if (checkedImgs[mosshaf] && now - checkedImgs[mosshaf] < 86400) {
			return;
		};

		if (navigator.connection.type == Connection.NONE) {
			return;
		}

		if (checkImgsBusy)
			return;
		//
		checkImgsBusy = true;

		shouldCheck('images', mosshaf, function(yes) {
			if (yes) {
				var urli = url_interface + "&do=fs&subj=images&param=" + mosshaf;
				var jxr = $.get(urli, null, _emp, 'text');

				jxr.done(function(j) {
					if (j) {
						try {
							j = $.parseJSON(j);
						} catch(e) {
							j = false;
						}
					}
					if (!j || !j.s || j.s.length != 604) {
						checkImgsBusy = false;
						return;
					}
					sizesImgs[mosshaf] = j.s;

					setKey("checked_" + mosshaf, now);

					var ih = new IFH(_afs, _uri + "/Ayat" + '/images/' + mosshaf, null, j.s);
					ih.onComplete = function(invalid) {
						checkImgsBusy = false;
						checkedImgs[mosshaf] = now;
						for (var i = 0; i < invalid.length; i++) {
							_afs.getFile(_relter(_uri + "/Ayat" + '/images/' + mosshaf + '/' + invalid[i] + '.png'), {
								create : false
							}, function(fE) {
								fE.remove(_emp, _emp);
							}, _emp);
						}
					}
					ih.run();
				});

				jxr.fail(function() {
					checkImgsBusy = false;
				});
			} else {
				checkImgsBusy = false;
				checkedImgs[mosshaf] = now;
			}
		});
	}
	var checkAudioBusy = false;
	var checkAudio = function(qaree, cb) {
		if (checkAudioBusy) {
			cb();
			return;
		}
		checkAudioBusy = true;

		var now = Math.round(Date.now() / 1000);
		if (checkedAudio[qaree] && now - checkedAudio[qaree] < 86400) {
			checkAudioBusy = false;
			cb();
			return;
		};

		if (!cb)
			cb = _emp;

		var cbi = function() {
			checkAudioBusy = false;
			cb();
		};
		if (navigator.connection.type == Connection.NONE) {

			cbi();
			return;
		}

		shouldCheck('audio', qaree, function(yes) {
			if (yes) {
				var dfd = $.Deferred();
				if (sizesAudio[qaree]) {
					dfd.resolve();
				} else {
					var urli = url_interface + "&do=fs&subj=audio&param=" + qaree;
					var jxr = _ajaxes.get(urli, 'text');

					jxr.done(function(j) {
						if (j) {//
							try {
								j = $.parseJSON(j);
							} catch(e) {
								j = false;
							}
						}
						if (j && j.s && j.s.length == 6236) {
							sizesAudio[qaree] = j.s;
							dfd.resolve();
						} else {
							dfd.reject();
						}

					});
					jxr.fail(function() {
						dfd.reject();
					});
				}

				dfd.done(function() {

					checkedAudio[qaree] = now;
					setKey('checked_' + qaree, now);
					var ah = new AFH(_afs, _uri + '/audio/' + qaree, null, sizesAudio[qaree]);
					ah.onComplete = function(invalid) {

						if (_extURI) {
							var ah2 = new AFH(_extFS, _extURI + '/Ayat/audio/' + qaree, null, sizesAudio[qaree]);
							ah2.onComplete = function(invalid2) {
								var ad;

								cbi();

								for (var i = 0; i < invalid2.length; i++) {
									ad = id2aya(invalid2[i], true);
									_extFS.getFile(_relter(_extURI + '/Ayat/audio/' + qaree + '/' + parseInt(ad.substr(0, 3), 10) + '/' + ad + '.mp3'), {
										create : false
									}, function(fE) {
										fE.remove(_emp, _emp);
									}, _emp);
								}
							}
							ah2.run();
						} else {
							cbi();
						}
						var ad;
						for (var i = 0; i < invalid.length; i++) {
							ad = id2aya(invalid[i], true);
							_afs.getFile(_relter(path + '/audio/' + qaree + '/' + parseInt(ad.substr(0, 3), 10) + '/' + ad + '.mp3'), {
								create : false
							}, function(fE) {
								fE.remove(_emp, _emp);
							}, _emp);
						}
					}////

					ah.run();
				});

				dfd.fail(function() {
					cbi();
				});
			} else {
				checkedAudio[qaree] = now;
				cbi();
			}
		});
	}
	function shouldCheck(what, param, cb) {
		if (!canCheck()) {
			cb(false);
			return;
		}
		var now = Math.round(Date.now() / 1000);
		var tchk = getKey('checked_' + param) || 0;

		if (tchk && (now - tchk < 86400)) {
			cb(false);
			return;
		}

		var urli = url_interface + "&do=lastmod&subj=" + what + "&param=" + param;
		var jxr = _ajaxes.get(urli, 'text');

		jxr.done(function(j) {
			if (j) {
				try {
					j = $.parseJSON(j);
				} catch(e) {
					j = false;
				}
			}

			if (!j || !j.s) {
				cb(false);
				return;
			}
			var mdt = isNaN(j.s) ? 0 : Number(j.s);
			if (mdt && mdt > tchk) {
				cb(true);
			} else {
				cb(false);
			}
		});
		jxr.fail(function() {
			cb(false);
		});
	}

	var movedAF = [];

	function moveAF(qaree, cb, fcb) {
		cb();
		return;
		//??
		if (!extAudio) {
			cb();
			return;
		}
		if (movedAF.indexOf(qaree) != -1) {
			cb();
			return;
		}
		movedAF.push(qaree);
		if (!fcb) {
			fcb = function() {
				cb();
			}
		}
		var from = _uri + '/Ayat/audio', to = extAudio + '/Ayat/audio', dname = qaree;

		_afs.getDirectory(_relter(to), {
			create : false
		}, function(toEntry) {

			_afs.getDirectory(_relter(to + '/' + dname), {
				create : false
			}, function() {

				_afs.getDirectory(_relter(from + '/' + dname), {
					create : false
				}, function(dirEntry) {
					dirEntry.copyTo(toEntry, dname, function() {//
						dirEntry.removeRecursively();
						cb(true);
					}, _emp);
					////
				}, _emp);

			}, function() {
				_afs.getDirectory(_relter(from + '/' + dname), {
					create : false
				}, function(dirEntry) {
					dirEntry.moveTo(toEntry, dname, function() {
						cb(true)
					}, _emp);
				}, _emp);
			});
		}, _emp);
	}

	var AFH = function(_fs, dir, stack, sSizes) {
		var __files = [], __sizes = {};

		// getDirName = parseInt( "090310.mp3".substr(0,3));
		var serialize = function() {
			var str = '';
			for (var i = 0; i < __files.length; i++) {
				str += __files.name.substr(0, 6);
			}
			return str;
		}
		var getFilesAsStack = function() {
			var stack = [];
			var an;
			for (var i = 0; i < __files.length; i++) {
				an = aya2id(parseInt(__files[i].name.substr(0, 3), 10), parseInt(__files[i].name.substr(3, 3), 10));
				stack.push(an);
			}
			return stack;
		}
		var fetchFiles = function(dir, cb) {////
			__files = [];
			_fs.getDirectory(_relter(dir), {
				create : false
			}, function(dE) {
				var dR = dE.createReader();

				var sub_dE = {}, sub_dR = {};
				dR.readEntries(function(subs) {
					var num_subs = subs.length, count_subs = 0;
					var i = 0;

					function read(i) {

						if (i >= num_subs) {
							cb();
							return;
						}
						sub_dE = subs[i];
						if (!sub_dE || !sub_dE.name || sub_dE.name == '.' || sub_dE.name == '..' || sub_dE.isFile) {
							read(i + 1);
							return;
                        }
						sub_dR = sub_dE.createReader();
						sub_dR.readEntries(function(files) {
							count_subs++;
							var num_files = files.length;
							for (var j = 0; j < num_files; j++) {
								if (!files[j] || !files[j].name || files[j].name.indexOf('.mp3') == -1)
									continue;

								__files.push(files[j]);
							}

							setTimeout(function() {
								read(i + 1);
							}, 80);

						}, function() {
							setTimeout(function() {
								read(i + 1);
							}, 80);
						});

					};

					read(i)

				});
			}, function() {
				cb();
			});
		}
		var fetchSizes = function(cb) {
			__sizes = {};
			var len = __files.length, count = 0;
			if (!len) {
				cb();
				return;
			}
            var toks = Math.ceil(len / 100);
            function start(begin,end){
                var lcount = begin;
                if(begin >= len) return;
                if(count >= len) return;
                
                if(end > len) end = len;
                
                for (var i = begin; i < end; i++) {
                    if(count == len) return;
                    __files[i].file(function(f) {

                        var fname = f.name.substr(0, f.name.length - 4);

                        var sura = Number(fname.substr(0, 3));
                        var aya = Number(fname.substr(3, 6));
                        __sizes[aya2id(sura, aya)] = f.size;
                        count++;
                        lcount++;
                        if (count == len) {
                            cb();
                            return;
                        } //
                        if(lcount == end){
                            setTimeout(function(){
                                start(end,end+100);
                            }, 100);
                        }

                    }, function() {

                        count++;
                        lcount++;
                        if (count == len) {
                            cb();
                            return;
                        }
                        if(lcount == end){
                            setTimeout(function(){
                                start(end,end+100);
                            }, 100);
                        }                        

                    });
                }
            }
            
            start(0,100);

		}
		var _this = this;
		//

		this.run = function() {
			fetchFiles(dir, function() {
				fetchSizes(function() {
					var existS = [], newS = [];
					var validsSizes = (sSizes && sSizes.length == 6236);
					if (!stack)
						stack = getFilesAsStack();
					for (var i = 0; i < stack.length; i++) {
						if (validsSizes) {
							if (__sizes[stack[i]] && sSizes[stack[i] - 1] && (__sizes[stack[i]] == sSizes[stack[i] - 1])) {
								existS.push(stack[i]);
							} else {
								newS.push(stack[i]);
							}
						} else {
							if (__sizes[stack[i]] && __sizes[stack[i]] > 1000) {
								existS.push(stack[i]);
							} else {//
								newS.push(stack[i]);
							}
						}
					}
					_this.onComplete(newS, existS);
				});
			});
		}
	};

	var IFH = function(_fs, dir, stack, sSizes) {
		var __files = [], __sizes = {};
		// getDirName = parseInt( "090310.mp3".substr(0,3));
		var getFilesAsStack = function() {
			var stack = [];
			for (var i = 0; i < __files.length; i++) {
				stack.push(parseInt(__files[i].name, 10));
			}
			return stack;
		}
		var fetchFiles = function(dir, cb) {//
			__files = [];
			_fs.getDirectory(_relter(dir), {
				create : false
			}, function(dE) {
				var dR = dE.createReader();
				dR.readEntries(function(files) {
					for (var i = 0; i < files.length; i++) {
						if (files[i].name == '.' || files[i].name == '..')
							continue;
						if (files[i].name.indexOf('.png') == -1)
							continue;

						__files.push(files[i]);
					}
					cb();
				});
			}, function() {
				cb();
			});
		}
		var getFiles = function() {
			return __files;
		}
		var fetchSizes = function(cb) {
			__sizes = {};
			var len = __files.length, count = 0;
			if (!len) {
				cb();
				return;
			}
			for (var i = 0; i < len; i++) {

				__files[i].file(function(f) {
					__sizes[parseInt(f.name, 10)] = f.size;
					count++;
					if (count == len) {
						cb();
						return;
					} //
				}, function() {
					count++;
					if (count == len) {
						cb();
						return;
					}
				});
			}

		}
		var _this = this;

		this.run = function() {
			fetchFiles(dir, function() {
				fetchSizes(function() {
					var existS = [], newS = [];
					var validsSizes = (sSizes && sSizes.length == 604);
					if (!stack)
						stack = getFilesAsStack();
					for (var i = 0; i < stack.length; i++) {
						if (validsSizes) {
							if (__sizes[stack[i]] && sSizes[stack[i] - 1] && (__sizes[stack[i]] == sSizes[stack[i] - 1])) {
								existS.push(stack[i]);
							} else {
								newS.push(stack[i]);
							}
						} else {
							if (__sizes[stack[i]] && __sizes[stack[i]] > 10000) {
								existS.push(stack[i]);
							} else {
								newS.push(stack[i]);
							}
						}
					}
					_this.onComplete(newS, existS);
				});
			});
		}
	};
	function moveFile(fromFS, fromPath, toFS, toPath, fname, cb, cbf) {
		fromFS.getFile(_relter(fromPath + "/" + fname), {
			create : false
		}, function(fE) {
			toFS.getDirectory(_relter(toPath), {
				create : true
			}, function(dE) {
				fE.moveTo(dE, fname, cb, cbf);
			}, cbf);
		}, cbf);
	}

	function moveAudioFile(fromFS, fromPath, toFS, toPath, qaree, sura, fname, cb, cbf) {
		fromFS.getFile(_relter(fromPath + "/" + qaree + "/" + sura + "/" + fname), {
			create : false
		}, function(fE) {
			toFS.getDirectory(_relter(toPath + "/" + qaree), {
				create : true
			}, function() {
				toFS.getDirectory(_relter(toPath + "/" + qaree + "/" + sura), {
					create : true
				}, function(dE) {
					fE.moveTo(dE, fname, cb, cbf);
				}, cbf);
			}, cbf);
		}, cbf);
	}
    var checkAudio_delay_times = 0;
	function checkAudioFile(fs, path, qaree, sura, aya, fname, cb) {
		if (navigator.connection.type == Connection.NONE) {
			cb("Err_conn");
			return;
		}
        if(checkAudio_delay_times >= 4){
            cb("Err_conn");
            return;
        }

		var aya_id = aya2id(sura, aya);
		var chk = function() {
			fs.getFile(_relter(path + "/" + qaree + "/" + sura + "/" + fname), {
				create : false
			}, function(fE) {
				fE.file(function(f) {
					if (f.size != sizesAudio[qaree][aya_id - 1]) {
						cb("Err_size",fE);
					} else {
						cb("Pass");
					}
				}, function() {
					cb("Err_fnf");
				});
			}, function() {
				cb("Err_fnf");
			});
		}
		if (sizesAudio[qaree]) {
			chk();
		} else {
			var urli = url_interface + "&do=fs&subj=audio&param=" + qaree;
			//
            var dfd = $.Deferred();
            
			var jxr = _ajaxes.get(urli, 'text');
            
			jxr.done(function(j) {
                
				if (j) {
					try {
						j = $.parseJSON(j);
					} catch(e) {
						j = false;
					}
				}

				if (j && j.s && j.s.length == 6236) {
					sizesAudio[qaree] = j.s;
				}
                
                
				if (sizesAudio[qaree]) {
					dfd.resolve();
				} else {
                    dfd.reject();
				}
			});

			jxr.fail(dfd.reject);
    
            dfd.done(function(){
                checkAudio_delay_times = 0;
                chk();
            });
            dfd.fail(function(){
                checkAudio_delay_times++;
                cb("Err_ajax");
            });
            
            setTimeout(dfd.reject, 10000);
		}
        
	}
    
    var checkImg_delay_times = 0
	function checkImgFile(fs, path, mosshaf, fname, cb) {
		if (navigator.connection.type == Connection.NONE) {
			cb("Err_conn");
			return;
		}
        if(checkImg_delay_times >= 4){
			cb("Err_conn");
			return;        
        }
		var c_file = parseInt(fname, 10);

		var chk = function() {
			fs.getFile(_relter(path + "/" + mosshaf + "/" + fname), {
				create : false
			}, function(fE) {
				fE.file(function(f) {
					if (f.size != sizesImgs[mosshaf][c_file - 1]) {
						cb("Err_size",fE);
					} else {
						cb("Pass");
					}
				}, function() {
					cb("Err_fnf");
				});
			}, function() {
				cb("Err_fnf");
			});
		}
        

        if (sizesImgs[mosshaf]) {
			chk();
		} else {
            var dfd = $.Deferred();

			var urli = url_interface + "&do=fs&subj=images&param=" + mosshaf;
			//
            var jxr = _ajaxes.get(urli, 'text');
            
			jxr.done(function(j) {
				if (j) {
					try {
						j = $.parseJSON(j);
					} catch(e) {
						j = false;
					}
				}

				if (j && j.s && j.s.length == 604) {
					sizesImgs[mosshaf] = j.s;
				}
				if (sizesImgs[mosshaf]) {
                    dfd.resolve();
				} else {
                    dfd.reject();
				}
			});
            jxr.fail(dfd.reject);

            dfd.done(function(){
                checkImg_delay_times = 0;
                chk();
            });
			dfd.fail(function(){
                checkImg_delay_times++;
				cb("Err_ajax");
			});
            setTimeout(dfd.reject, 5000);
		}
	}

	var loadedAudio = [], loadingAudio = {}, checkedAudio = {}, sizesAudio = {}, audioCBS = {};
	SG.getAudio = function (qaree, sura, aya, cid, done, fail) {
	    //cid = cid + 10;
		if (done)
			SG._ap1.onStart();

		if (!done)
		    done = _emp;
		if (!fail)
		    fail = _emp;

		var cb = function (fl,id) {
		    loadedAudio.push(fl);
		   // alert("DONE: " + fl + " : " + id);
		    done(fl, id);

		    if (loadedAudio.length > 3) {
		        loadedAudio.shift();
		    }
		}
		var cbf = function (fl,id) {
		    fail(id);
		}
		

		var dir = qaree + '/' + sura;
		var fname = paddingAya(sura) + paddingAya(aya) + '.mp3';
		var fl = dir + '/' + fname;
		if (_extURI) {
			var path = _extURI;
			var _fs = _extFS;
		} else {
			var path = _uri;
			var _fs = _afs;
		}
		path += "/Ayat/audio";

	    //console.log("GETTING AUDIO");


		if (loadedAudio.indexOf(path + "/" + fl) != -1) {
			cb(path + "/" + fl, cid);
			return;
		}


		if (didDir.indexOf(path + "/" + qaree) == -1) {
			_fs.getDirectory(_relter(path + "/" + qaree), {
				create : true
			}, function() {
				didDir.push(path + "/" + qaree);
				doNoMed();
			}, _emp);
		} else {
			doNoMed();
		}

		function doNoMed() {
			if (_platform_ == "android" && didNoMed.indexOf(path + "/" + dir) == -1) {
				var p = path + "/" + dir + '/' + '.nomedia';
				_fs.getDirectory(_relter(path + "/" + dir), {
					create : true
				}, function() {
					_fs.getFile(_relter(p), {
						create : true
					}, function() {
						didNoMed.push(path + "/" + dir);
						doJob();
					}, _emp);
				}, _emp);
			} else {
				doJob();
			}
		}

		function doJob() {
            setTimeout(function(){
                //checkAudio(qaree, _emp);
            }, 2000);

            if (_extURI) {
                var lc = path + "/" + fl;
                var lcAlt = _uri + '/Ayat/audio/' + fl;
                var lcFinal = lc + '|' + lcAlt;
                _extFS.getFile(_relter(lc), {
                    create : false
                }, function(f) {
                    checkAudioFile(_extFS, path, qaree, sura, aya, fname, function(ret,fE){
                        if(ret == "Pass" || ret == "Err_conn" || ret == "Err_ajax"){
                            cb(lc,cid);	
                        }
                        else if(ret == "Err_size"){
                            fE.remove(function(){
                                loadF(_extFS, _extURI + '/Ayat/audio', qaree, sura, fname);
                            }, function(){
                                loadF(_extFS, _extURI + '/Ayat/audio', qaree, sura, fname);
                            });
                        }
                        else if(ret == "Err_fnf"){
                            loadF(_extFS, _extURI + '/Ayat/audio', qaree, sura, fname);
                        }
                    });
                }, function() {
                    _afs.getFile(_relter(lcAlt), {
                        create : false
                    }, function(f) {
                        moveAudioFile(_afs, _uri + '/Ayat/audio', _extFS, _extURI + '/Ayat/audio', qaree, sura, fname, function() {
                            checkAudioFile(_extFS, path, qaree, sura, aya, fname, function(ret,fE){
                                if(ret == "Pass" || ret == "Err_conn" || ret == "Err_ajax"){
                                    cb(lc,cid);	
                                }
                                else if(ret == "Err_size"){
                                    fE.remove(function(){
                                        loadF(_extFS, _extURI + '/Ayat/audio', qaree, sura, fname);
                                    }, function(){
                                        loadF(_extFS, _extURI + '/Ayat/audio', qaree, sura, fname);
                                    });
                                }
                                else if(ret == "Err_fnf"){
                                    loadF(_extFS, _extURI + '/Ayat/audio', qaree, sura, fname);
                                }
                            });
                        }, function() {
                            loadF(_extFS, _extURI + '/Ayat/audio', qaree, sura, fname);
                        });
                    }, function() {
                        loadF(_extFS, _extURI + '/Ayat/audio', qaree, sura, fname);
                    });
                });
            } else {
                var lc = path + "/" + fl;

                _afs.getFile(_relter(lc), {
                    create : false
                }, function(f) {
                    checkAudioFile(_afs, path, qaree, sura, aya, fname, function(ret,fE){
                        if(ret == "Pass" || ret == "Err_conn" || ret == "Err_ajax"){
                            cb(lc,cid);	
                        }
                        else if(ret == "Err_size"){
                            fE.remove(function(){
                                loadF(_afs, _uri + '/Ayat/audio', qaree, sura, fname);
                            }, function(){
                                loadF(_afs, _uri + '/Ayat/audio', qaree, sura, fname);
                            });
                        }
                        else if(ret == "Err_fnf"){
                            loadF(_afs, _uri + '/Ayat/audio', qaree, sura, fname);
                        }
                    });
                }, function() {
                    loadF(_afs, _uri + '/Ayat/audio', qaree, sura, fname);
                });

            }

		}
		var loadF_c = 0;
		function loadF(_fs, path, qaree, sura, fname) {
			if(loadF_c++ > 10) return;
			new SG.loadFile(_fs, base_mp3url + '/' + qaree + '/' + fname, path + "/" + qaree + "/" + sura + "/" + fname, false, function(dld) {
                
				checkAudioFile(_fs, path, qaree, sura, aya, fname, function(ret,fE){
					if(ret == "Pass" || ret == "Err_conn" || ret == "Err_ajax"){
						cb(path + "/" + qaree + "/" + sura + "/" + fname, cid);
					}
					else if(ret == "Err_size"){
						fE.remove(function(){
							loadF(_fs, path, qaree, sura, fname);//
						}, function(){
							loadF(_fs, path, qaree, sura, fname);
						});
					}
					else if(ret == "Err_fnf"){
						loadF(_fs, path, qaree, sura, fname);
					}
				});



			}, function() {
			    if (cbf) {
                    //alert(cid)
			        cbf(path + "/" + qaree + "/" + sura + "/" + fname, cid);
			    }
			});

		}

	}
	SG.preloadAudio = function (qaree, sura, aya) {
	    if (_platform_ == "wp") {
	        SG.getAudio(qaree, sura, aya, 0, false, false);
	    }
	    else {
	        setTimeout(function () {
	            SG.getAudio(qaree, sura, aya, 0, false, false);
	        }, 1000);
	    }
	}
	SG.APlayer = function() {

		this.p = {};
		this.status = 'Init';
		this.bypassCB = 0;
		this.st_cds = ["None", "Starting", "Running", "Paused", "Stopped"];
		this.stop_t = 0;
		this.apply_t = 0;
		this.applyCB = 0;
		this.p = false;
        this.duration = 0;
        this.startTime = 0;
		var _this = this;

		this.play = function (file) {
		    //alert(file);
			if (!file) {
				if (!_this.p)
					return;
			    try {
					_this.p.play();
				} catch (e) {}
				return;
			}

			this.stop();
			this.onPlay();

			_this.p = new Media(file, function () {
			    if (_this.applyCB) {
                    
                    if(_this.duration && _this.startTime && ((Date.now()+950 - _this.startTime) < (_this.duration*1000)) ){
                        stopPlayer();
                        if(! durationStopped){
                            $("#tls_play").trigger(END_EV);
                        }
                        durationStopped = true;
                    }
                    else{
                        durationStopped = false;
                        _this.applyCB = 0;
                        _this.onComplete();
                    }
			    }
			}, function (err) {
			    _this.applyCB = 0
			}, function (st) {
			    if (st == 2) {
			        _this.applyCB = 1;
			    }
			    _this.status = _this.st_cds[st] || 'Unknown';
			});

		    try {
                _this.p.play();
                _this.startTime = Date.now();
			} catch (e) { }

			_this.applyCB = 0;

			if (_this.apply_t)
			    clearTimeout(_this.apply_t);

			_this.apply_t = setTimeout(function () {
			    _this.apply_t = 0;
			    _this.applyCB = 1;
			}, 1000);

			//if (repeat_started) {
            var dur_counter = 0;
            var dur_timerId = setInterval(function () {
                
                try {
                    _this.duration = Number(_this.p.getDuration());
                } catch (e) {}
                if(_this.duration > 0 || dur_counter > 2000){
                    clearInterval(dur_timerId);
                }
                else{
                    dur_counter += 200;
                }
                
			 }, 200);
			//}

		}
		this.pause = function() {
			if (!this.p)
				return;
			if (_this.status != 'Starting' && _this.status != 'Running') {
				return;
			}
			try {
				this.p.pause();
			} catch (e) {}
		}
		this.stop = function() {
			if (!this.p)
				return;
			try {
				this.onComplete = function() {
				};
				this.applyCB = 0;
                this.duration = 0;
                this.startTime = 0;
                
				this.p.stop();
				this.p.release();
				this.p = null;
				if (_this.apply_t)
					clearTimeout(_this.apply_t);
				_this.apply_t = 0;
			} catch (e) {
			}
		}
		this.onComplete = function() {
		};
		this.load = function() {

		}
		this.getState = function() {
			return this.status;
		}

		this.onError = function() {
		}
	}

	var Downloader = function(stack, check, num_exist, stackParser, prog) {
		this.stack = stack;
		this.count = this.stack.length + num_exist;
		this.dled = num_exist;
		this.paused = false;
		this.prog = prog || false;
		this.failedS = [];
		this.onTouch = function() {
		};
		//this.init();
		this.eng = $('<span></span>');
		this.start = function() {
			this.download();
		}
		var _this = this;
		this.on = function(e, cb) {
			this.eng.on(e, cb);
		}
		this.trigger = function(e) {
			this.eng.trigger(e);
		}
		this.off = function(e) {
			this.eng.off(e);
		}
		this.pause = function() {
			document.removeEventListener("online", _this.online, false);
			this.paused = true;
			this.trigger('pause');
		}
		this.resume = function() {
			document.removeEventListener("online", _this.online, false);
			this.paused = false;
			this.trigger('resume');
			this.download();
		}
		this.stop = function() {
			this.loader.stop();
			this.trigger('stop');
		}
        this.hide = function(){
            this.trigger('hide');
        }
		this.onProgress = function() {
		};
		this.online = function() {
			trace("Went Online");
			_this.resume();
		}
		if (this.prog) {
			this.loaded = 0;
			this.total = 0;
			this.download = function() {
				if (!_this.stack.length) {
					_this.trigger('complete');
					return;
				}

				var c_file = _this.stack.shift();
				if (!c_file)
					return;

				stackParser(c_file, function(parsed) {
					_this.loader = new SG.loadFile(_afs, parsed['u'], parsed['n'], false, function() {
						_this.trigger('complete');
					}, function(err) {

					}, function (loaded, total) {
					    //alert("progress");
						_this.loaded = loaded;
						_this.total = total;
						_this.trigger('progress');
					});
				});
			}
		} else {
			this.download = function() {
				//trace("stack Lengh: "+arr.length);
				if (!_this.stack.length) {
					//trace("COMPLETED");

					_this.trigger('complete');
					return;
				}
				var c_file = _this.stack.shift();

				if (!c_file) {
					return;
				}

				stackParser(c_file, function(parsed) {

					_this.loader = new SG.loadFile(parsed['f'], parsed['u'], parsed['n'], check, function(dld) {
						//trace("D4Done");

						if (parsed['size']) {
							_afs.getFile(_relter(parsed['n'].split('|')[0]), {
								create : false
							}, function(fE) {
								fE.file(function(f) {
									if (f.size == parsed['size']) {
										_this.dled++;
										_this.trigger('progress');
									} else {
										fE.remove(_emp, _emp);
										stack.push(c_file);
									}
								}, function() {//
									_this.dled++;
									_this.trigger('progress');
								});
							}, function() {
								_this.dled++;
								_this.trigger('progress');
							});
						} else {
							if (dld == "downloaded") {
								_this.onTouch();
							}
							_this.dled++;
							_this.trigger('progress');
						}

						if (_this.paused) {
							return;
							////
						}
						if (_platform_ == "wp") {
						    _this.download()
						}
						else {
						    setTimeout(function () {
						        _this.download()
						    }, 50);
						}

					}, function() {

						stack.push(c_file);

						if (_this.paused) {
							return;
							////
						}

						if (navigator.connection.type == Connection.NONE) {
							trace("Went Offline");
							_this.trigger('pause');
							document.addEventListener("online", _this.online, false);
							return;
						}

						if (_platform_ == "wp") {
						    _this.download()
						}
						else {
						    setTimeout(function () {
						        _this.download()
						    }, 50);
						}

					}, null);

				});

			}
		}
	}
	var dMonitor = function(dl, cname, div_id) {
		//this.id = qaree + '' + from + '' + to;
		//this.qaree = qaree;
		this.dl = dl;
		this.cname = cname;
		this.done = false;
		this.puased = false;
		this.stopped = false;
		var id2 = 'm_' + Math.round(Math.random() * 100000);
		this.id2 = id2;
		//this.id =
		$(".downcomp").clone().removeClass('downcomp').addClass('dcomp').attr('id', this.id2).prependTo("#" + div_id);
		if (this.dl.prog) {
			var ap = 0;
			var prevP = 0;
			this.update = function() {
				//this.pinfo.html(info(this.dl.loaded , this.dl.total));
				//trace(Math.round((this.dl.loaded / this.dl.total)*100) + '% '+this.dl.loaded +":"+ this.dl.total);
				if (prevP > this.dl.loaded)
					return;
				prevP = this.dl.loaded;

				var r = Math.round(((this.dl.loaded / progress_factor) / this.dl.total) * 100);
				if (r >= 90)
					r = 90;

				if (!(ap++ % 100)) {
					this.pbar.width(r + '%');
				}
			}
		} else {
			this.update = function() {
				this.pinfo.html(this.dl.dled + '/' + this.dl.count);
				this.pbar.width(((this.dl.dled / this.dl.count) * 100) + '%');
			}
		}

		this.attach = function() {
			//trace("ATTACHING");
			this.comp = $("#" + this.id2);
			this.pbar = this.comp.find('.pbar');
			this.pinfo = this.comp.find('.pinfo');
			this.contrs = this.comp.find('.contrs');
			this.resumeBu = this.comp.find('.resumeBu').hide();
			this.pauseBu = this.comp.find('.pauseBu').hide();
			this.stopBu = this.comp.find('.stopBu').hide();
			this.compBu = this.comp.find('.compBu').hide();

			this.resumeBu.click(function() {
				_this.dl.resume();
			});
			this.pauseBu.click(function() {
				_this.dl.pause();
			});
			this.stopBu.click(function() {
				_this.dl.stop();
			});
			this.compBu.click(function() {
				$("#" + _this.id2).fadeOut();
                _this.dl.hide();
			});
			this.update();

			if (this.dl.prog) {
				if (!this.stopped) {
					this.stopBu.show();
				}
			} else if (this.paused) {
				this.resumeBu.show();
			} else {
				this.pauseBu.show();
			}

		}
		this.attach();

		//this.stopBu = comp.find('.stop');
		var _this = this;
		/*
		 this.stopBu.click(function(){
		 _this.dl.stop();
		 });
		 */

		$("#" + this.id2).find('legend').html(this.cname);
		//this.pbar.width("300px");

		this.dl.on('progress', function() {
			_this.update()

			//_this.pinfo.html('تم تحميل '+ this.dled + ' آية من أصل ' + this.count + ' مطلوب تحميلها ');
			//_this.pbar.width( ((this.dled / this.count)*100) + '%');
		});
		this.dl.on('complete', function () {
			_this.pbar.width('100%');
			_this.pbar.addClass('complete');
			_this.pauseBu.hide();
			_this.resumeBu.hide();
			_this.stopBu.hide();
			_this.compBu.show();
		});
		this.dl.on('pause', function() {
			_this.pbar.addClass('pause');
			_this.paused = true;
			_this.pauseBu.hide();
			_this.resumeBu.show();
		});
		this.dl.on('stop', function() {
			_this.stopped = true;
			_this.comp.hide();
			//_this.pbar.addClass('stop');
			//_this.contrs.hide();
		});
		this.dl.on('resume', function() {
			_this.paused = false;
			_this.pbar.removeClass('pause');
			_this.pauseBu.show();
			_this.resumeBu.hide();
		});
		this.dl.on('stop', function() {
			_this.pbar.removeClass('pause');
			_this.pbar.addClass('stop');
			_this.contrs.hide();
		});
	}
	downloads = [];

	SG.download_startAudio = function(cb) {

		var from = $("#m_sel_begin_sura").val() + '_' + $("#m_sel_begin_aya").val();
		var to = $("#m_sel_end_sura").val() + '_' + $("#m_sel_end_aya").val();
		var qaree = $("#m_quraa").val();

		var stack = [];
		var hasExtAndPrev = false;
		var fromSura = Number(from.split('_')[0]);
		var fromAya = Number(from.split('_')[1]);

		var toSura = Number(to.split('_')[0]);
		var toAya = Number(to.split('_')[1]);

		if (qaree == 'khaleefa_96kbps') {
			if (fromSura < 46)
				fromSura = 46;
			if (toSura < 46)
				toSura = 46;
		}

		var j, k;

		var fromId = aya2id(fromSura, fromAya);
		var toId = aya2id(toSura, toAya);

		if (fromId > 1)
			stack = [1];
		// add Basmallah
		for (var i = fromId; i <= toId; i++) {
			stack.push(i);
		}

		var path = (_extURI) ? _extURI : _uri;
		var _fs = (_extURI) ? _extFS : _afs;
		//
		path += '/Ayat/audio';
		if (_extURI) {
			_afs.getDirectory(_relter(_uri + '/Ayat/audio/' + qaree), {
				create : false
			}, function() {
				hasExtAndPrev = true;
			}, _emp);
		}
		var dfd = $.Deferred();
		if (sizesAudio[qaree]) {
			dfd.resolve();
		} else {
			var urli = url_interface + "&do=fs&subj=audio&param=" + qaree;
			//
			var jxr = _ajaxes.get(urli, 'text');

			jxr.done(function(j) {
				if (j) {
					try {
						j = $.parseJSON(j);
					} catch(e) {
						j = false;
					}
				}

				if (!j || !j.s || j.s.length != 6236) {
					dfd.reject();
				} else {
					sizesAudio[qaree] = j.s;
					dfd.resolve();
				}
			});
			jxr.fail(dfd.reject);
		}

		dfd.done(function() {
			if (canCheck()) {
				var ah = new AFH(_fs, path + '/' + qaree, stack, sizesAudio[qaree]);
				ah.onComplete = function(newS, existS) {
					cb();
					start(newS, existS, true);
				}////

				ah.run();
			} else {
				cb();
				start(stack, [], true);
				//
			}

		});

		dfd.fail(function() {
			//alert(_lang['chk_conn']);
			cb();
            start(stack, [], true);
		});
        
        setTimeout(dfd.reject, 15000);
        
		function start(stack, exist, check) {
			_fs.getDirectory(_relter(path + "/" + qaree), {
				create : true
			}, function() {
				doStart();
			}, _emp);

			function doStart() {

				var exist_len = exist.length || 0;

				var dl = new Downloader(stack, check, exist_len, function(c_file, cb) {
					//var n_aya = paddingAya(c_file.split('_')[0])+paddingAya(c_file.split('_')[1])+'.mp3';
					var suraAya = id2aya(c_file);

					var sura = suraAya.split('_')[0];
					var aya = suraAya.split('_')[1];

					var dir = qaree + "/" + sura;

					var fname = paddingAya(sura) + '' + paddingAya(aya) + '.mp3';

					if (didDir.indexOf(path + "/" + dir) == -1) {
						_fs.getDirectory(_relter(path + "/" + dir), {
							create : true
						}, function() {
							didDir.push(path + "/" + dir);
							doNoMed();
						}, _emp);
					} else {
						doNoMed();
					}

					function doNoMed() {
						if (_platform_ == "android" && didNoMed.indexOf(path + "/" + dir) == -1) {
							_fs.getFile(_relter(path + "/" + dir + '/' + '.nomedia'), {
								create : true
							}, function() {
								didNoMed.push(path + "/" + dir);
								doJob();
							}, _emp);
						} else {
							doJob();
						}
					}

					function doJob() {
						var size = (sizesAudio[qaree]) ? sizesAudio[qaree][c_file - 1] : false;
						var fpath = path + '/' + dir + '/' + fname;
						var ret = {
							u : base_mp3url + '/' + qaree + '/' + fname,
							f : _fs,
							n : fpath,
							size : size
						}
						if (hasExtAndPrev) {
							var pathAlt = _uri + '/Ayat/audio/';
							moveFile(_afs, pathAlt + '/' + dir, _extFS, path + '/' + dir, fname, function() {
								cb(ret);
							}, function() {
								cb(ret);
							});
						} else {
							cb(ret);
							//
						}
					}

				});

				var qareeT = false;
				dl.onTouch = function() {
					if (qareeT)
						return;
					qareeT = true;
					remKey("checked_" + qaree);
				};

				var inf = '<span class="lang" id="lang_download_downloadingFrom">' + _lang['from'] + '</span> ' + getSuraName(fromSura) + ':' + fromAya + ' ' + '<span class="lang" id="lang_to">' + _lang['to'] + '</span>' + ' ' + getSuraName(toSura) + ':' + toAya + ' | ' + getQareeName(qaree);

				downloads.push(new dMonitor(dl, inf, 'dcomp_audio'));
                var rd = rand(1001,1999);
                SG.Notifier.add({id:rd, title:_lang['ayatApp']+' - '+_lang['downloadingRecite'], message: _lang['downloadingRecite']+ ' ' +_lang['forReciter']+': '+getQareeName(qaree),icon:'ic_ayat',smallIcon:'ic_ayat',sound:null });  
                dl.on('complete', function() {
					activeDowns--;
                    setTimeout(function(){
                        SG.Notifier.add({id:rd, title:_lang['ayatApp']+' - '+_lang['downloadingReciteComped'], message: _lang['downloadingReciteComped']+ ' ' +_lang['forReciter']+': '+getQareeName(qaree),icon:'ic_ayat',smallIcon:'ic_ayat',sound:null });  
                    }, 1000);
                });
                dl.on('pause', function(){
                    SG.Notifier.add({id:rd, title:_lang['ayatApp']+' - '+_lang['downloadingRecitePaused'], message: _lang['downloadingRecitePaused']+ ' ' +_lang['forReciter']+': '+getQareeName(qaree),icon:'ic_ayat',smallIcon:'ic_ayat',sound:null });  
                });
                dl.on('resume', function(){
                    SG.Notifier.add({id:rd, title:_lang['ayatApp']+' - '+_lang['downloadingRecite'], message: _lang['downloadingRecite']+ ' ' +_lang['forReciter']+': '+getQareeName(qaree),icon:'ic_ayat',smallIcon:'ic_ayat',sound:null });  
                });
                dl.on('hide', function(){
                    SG.Notifier.cancel(rd,_emp);
                });
                

                
                

				dl.start();

				activeDowns++;

			}

		}

	}

	SG.download_startImages = function(cb) {

		var mosshaf = $("#m_masahef").val();
		var from = Number($("#m_pages_from").val());
		var to = Number($("#m_pages_to").val());

		var stack = [], newStack = [], existStack = [];

		for (var i = from; i <= to; i++) {
			stack.push(i);
		}
		var dfd = $.Deferred();
		if (sizesImgs[mosshaf]) {
			dfd.resolve();
		} else {
			var urli = url_interface + "&do=fs&subj=images&param=" + mosshaf;
			//
			var jxr = _ajaxes.get(urli, 'text');

			jxr.done(function(j) {
				if (j) {
					try {
						j = $.parseJSON(j);
					} catch(e) {
						j = false;
					}
				}
				if (!j || !j.s || j.s.length != 604) {
					dfd.reject();
				} else {
					sizesImgs[mosshaf] = j.s;
					dfd.resolve();
				}
			});
			jxr.fail(dfd.reject);
		}

		dfd.done(function(j) {

			if (canCheck()) {
				var ih = new IFH(_afs, _uri + '/Ayat/images/' + mosshaf, stack, sizesImgs[mosshaf]);
				ih.onComplete = function(newS, existS) {
					cb();
					start(newS, existS, true);
				}////
				ih.run();
			} else {
				cb();
				start(stack, [], true);
			}

		});

		dfd.fail(function() {
			//alert(_lang['chk_conn']);
			cb();
            start(stack, [], true);
		});
        setTimeout(dfd.reject, 15000);

		function start(stack, exist, check) {

			var url = masahef[mosshaf]['url'];
			var folder = masahef[mosshaf]['folder'];
			var ext = masahef[mosshaf]['ext'];

			var exist_len = exist.length || 0;

			var dl = new Downloader(stack, check, exist_len, function(c_file, cb) {
				var size = (sizesImgs[mosshaf]) ? sizesImgs[mosshaf][c_file - 1] : false;

				cb({
					f : _afs,
					u : url + c_file + '.' + ext,
					n : _uri + "/Ayat" + '/images/' + folder + '/' + c_file + '.' + ext,
					size : size
				});
			});

			var inf = 'Page: ' + from + ' : ' + to;

			downloads.push(new dMonitor(dl, inf, 'dcomp_images'));
            var title = '';
            var rd = rand(2001,2999);
            SG.Notifier.add({id:rd,title:_lang['ayatApp']+' - '+_lang['downloadingPages'], message:_lang['downloadingPages']+ ' - '+_lang['mosshaf_type'] + ': '+_lang['mosshaf_'+folder],icon:'ic_ayat',smallIcon:'ic_ayat',sound:null });  
            dl.on('complete', function() {
                activeDowns--;
                setTimeout(function(){
                    SG.Notifier.add({id:rd,title:_lang['ayatApp']+' - '+_lang['downloadingPagesComped'], message:_lang['downloadingPagesComped']+ ' - '+_lang['mosshaf_type'] + ': '+_lang['mosshaf_'+folder],icon:'ic_ayat',smallIcon:'ic_ayat',sound:null });  
                    
                }, 1000);

            });
            dl.on('pause', function(){
                SG.Notifier.add({id:rd,title:_lang['ayatApp']+' - '+_lang['downloadingPagesPaused'], message:_lang['downloadingPagesPaused']+ ' - '+_lang['mosshaf_type'] + ': '+_lang['mosshaf_'+folder],icon:'ic_ayat',smallIcon:'ic_ayat',sound:null });  
            });
            dl.on('resume', function(){
                SG.Notifier.add({id:rd,title:_lang['ayatApp']+' - '+_lang['downloadingPages'], message:_lang['downloadingPages']+ ' - '+_lang['mosshaf_type'] + ': '+_lang['mosshaf_'+folder],icon:'ic_ayat',smallIcon:'ic_ayat',sound:null });  
            });
            dl.on('hide', function(){
                SG.Notifier.cancel(rd,_emp);
            });            

			var mosshafT = false;
			dl.onTouch = function() {
				if (mosshafT)
					return;
				mosshafT = true;
				remKey("checked_" + mosshaf);
			};

			dl.start();
			activeDowns++;
		}

	}

	SG.download_startTtarajem = function(cb) {

		var fl = $("#m_ttarajem").val();
		var caption = $("#m_ttarajem option[value='" + fl + "']").html();
		var tp = fl.split('|')[0];
		fl = fl.split('|')[1];

		_afs.getFile(_relter(_uri + "/Ayat" + '/' + tp + '/' + fl + '.' + res_ext), {
			creata : false
		}, function(fE) {
			var urli = url_interface + "&do=fs&subj=" + ((tp == "tarajem") ? "tarajem" : "tafasir") + "&param=" + fl;
			var jxr = $.get(urli, null, _emp, 'text');
			jxr.done(function(j) {
				if (j) {
					try {
						j = $.parseJSON(j);
					} catch(e) {
						j = false;
					}
				}

				if (j && j.s) {
					cb();
					fE.file(function(f) {
						if (f.size == j.s) {
							start([]);
						} else {
							start([fl]);
						}
					}, function() {
						start([fl]);
					});
				} else {
					alert(_lang['chk_conn']);
					cb();
				}

			});

			jxr.fail(function() {
				alert(_lang['chk_conn']);
				cb();
			});
		}, function() {
			cb();
			start([fl]);
		});

		function start(stack) {

			var dl = new Downloader(stack, false, 0, function(c_file, cb) {
				cb({
					f : _afs,
					u : res_url + '/' + tp + '/' + fl + '.' + res_ext,
					n : _uri + "/Ayat" + '/' + tp + '/' + c_file + '.' + res_ext
				});
			}, true);

			downloads.push(new dMonitor(dl, caption, 'dcomp_ttarajem'));

            var rd = rand(3001,3999);
            SG.Notifier.add({id:rd,title:_lang['ayatApp']+' - '+_lang['downloadingTTafasir'], message: ((tp == "tafasir")?_lang['tafsir']:_lang['trans'])+": "+caption,icon:'ic_ayat',smallIcon:'ic_ayat',sound:null });  
            dl.on('complete', function() {
			    if (tp == "tarajem" && fl == currTrans) {
                    SG.refreshTransPane();
			    }
                activeDowns--;
                setTimeout(function(){
                    SG.Notifier.cancel(rd,_emp);
                }, 1000);

            });
            dl.on("stop",function(){
                setTimeout(function(){
                    SG.Notifier.cancel(rd,_emp);
                }, 1000);
            });

            dl.on('hide', function(){
                SG.Notifier.cancel(rd,_emp);
            });            
            
			dl.start();
			activeDowns++;
		}

	}


	$(window).unload(function() {
		savePendDL();
		try {
			SG._ap1.stop();
		} catch(e) {}
        
        SG.Notifier.cancelAll(_emp);

	});

	var pdl = getKey('pendDL');
	remKey('pendDL');
	if (pdl) {
		setTimeout(function() {
			var pdls = pdl.split('|||');
			for (var i in pdls) {
				if (pdls[i]) {
					delFile(pdls[i]);
				}
			}

		}, 3000);
	}

})(window, $);

function canCheck() {
    if (_platform_ == "wp") return false;

	if (navigator.userAgent.indexOf("Android") == -1)
		return true;

	var mats = navigator.userAgent.match(/Android ([\d])\.([\d])/i);

	if (mats[1] >= 4)
		return true;

	return false;

}

function inPendDL(id) {
	var n = pendDL.length;
	var tmp = [];
	for (var i = 0; i < n; i++) {
		if (id == pendDL[i])
			return true;
	}
	return false;
}

function savePendDL() {
	if (pendDL.length) {
		var str = '';
		var n = 0;
		//
		for (var i in pendDL) {
			str += ((n++) ? '|||' : '') + pendDL[i];
		}
		setKey('pendDL', str);
	} else {
		remKey('pendDL');
	}
}

function remPendDL(id) {
	var n = pendDL.length;
	var tmp = [];
	for (var i = 0; i < n; i++) {
		if (id == pendDL[i])
			continue;
		tmp.push(pendDL[i]);
	}
	pendDL = tmp;
}

function delFile(fl) {
	_afs.getFile(_relter(fl), {
		create : false
	}, function(fE) {
		fE.remove();
	}, function() {
	});
}

function checkTarjama(db) {
	var now = Math.round(Date.now() / 1000);
	if (getKey('checked_' + db) && ((now - getKey('checked_' + db)) < 86400)) {
		return;
	}

	var urli = url_interface + "&do=fs&subj=tarajem&param=" + db;
	var jxr = $.get(urli, null, _emp, 'text');

	jxr.done(function(j) {
		if (j) {
			try {
				j = $.parseJSON(j);
			} catch(e) {
				j = false;
			}
		}

		if (j && j.s) {
			_afs.getFile(_relter(_uri + "/Ayat" + '/tarajem/' + db + '.' + res_ext), {
				creata : false
			}, function(fE) {
				fE.file(function(f) {
					setKey('checked_' + db, now);

					if (f.size != j.s) {//
						if (confirm(_lang['confirm_update_trans'])) {
							if (currActiveWin) {
								currActiveWin.find(".popup_close").trigger(END_EV);
							}

							SG.ToolsMenu.toggle(-1);
							SG.Menu.setAltSub('sm_downloadTtarajem');
							SG.Menu.toggle(1);
							setTimeout(function() {

								$("#m_ttarajem").val("tarajem|" + db).change();
								$("#bu_m_ttarajem").trigger("tapone");
							}, 1200);
						}
					}

				}, _emp);
			}, _emp);
		}

	});
}

function checkTafsir(author) {
	var now = Math.round(Date.now() / 1000);
	if (getKey('checked_' + author) && ((now - getKey('checked_' + author)) < 86400)) {
		return;
	}

	var urli = url_interface + "&do=fs&subj=tafasir&param=" + author;
	var jxr = $.get(urli, null, _emp, 'text');
	jxr.done(function(j) {
		if (j) {
			try {
				j = $.parseJSON(j);
			} catch(e) {
				j = false;
			}
		}

		if (j && j.s) {
			_afs.getFile(_relter(_uri + "/Ayat" + '/tafasir/' + author + '.' + res_ext), {
				creata : false
			}, function(fE) {
				fE.file(function(f) {
					setKey('checked_' + author, now);

					if (f.size != j.s) {//
						if (confirm(_lang['confirm_update_tafsir'])) {
							if (currActiveWin) {
								currActiveWin.find(".popup_close").trigger(END_EV);
							}
							SG.ToolsMenu.toggle(-1);
							SG.Menu.setAltSub('sm_downloadTtarajem');
							SG.Menu.toggle(1);
							setTimeout(function() {

								$("#m_ttarajem").val("tafasir|" + author).change();
								$("#bu_m_ttarajem").trigger("tapone");
							}, 1200);
						}
					}

				}, _emp);
			}, _emp);
		}

	});

}

var _rx = false;
var _rxExt = false;
// function for making canonical paths, converting absolute to relative to the storage folder, and keep it unified
function _relter(lc) {
	if (!_rx) {
		_rx = new RegExp(_uri + '/?', "i");
	}
	if (_extURI) {
		if (!_rxExt) {
			_rxExt = new RegExp(_extURI + '/?', "i");
		}
		lc = lc.replace(_rxExt, "");
	}

	return lc.replace(_rx, "");

}


Agent = (function(){
    var isWP=false,isAndroid=false,isIOS=false,isOther=false;
    var _vArr, _vC;

    isWP = (navigator.userAgent.toLowerCase().indexOf("windows phone") != -1);
    isAndroid = !isWP && (navigator.userAgent.toLowerCase().indexOf("android") != -1);
    isIOS  = !isWP && !isAndroid && /ip(hone|od|ad)/i.test(navigator.userAgent.toLowerCase());
    isOther  = !isWP && !isAndroid && !isIOS;
    function iosVer() {
        if (! isIOS) return null;

        var v = navigator.userAgent.toLowerCase().match(/os (\d+)_(\d+)_?(\d+)?/);
        if(! v) return null;
        return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
    }
    function androidVer(){
        if (! isAndroid) return null;

        var v = navigator.userAgent.toLowerCase().match(/android (\d+)\.(\d+)\.?(\d+)?/i);
        if(! v) return null;
        return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];            
    }
    function wpVer(){
        if (! isWP) return null;

        var v = navigator.userAgent.toLowerCase().match(/windows phone (\d+)\.(\d+)\.?(\d+)?/i);
        if(! v) return null;
        return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];            
    }        
    function getVer(){
        if(isAndroid) return androidVer();
        if(isIOS) return iosVer();
        if(isWP) return wpVer();
        return null;
    }
    function _num(p1,p2,p3){
        return (parseInt(p1 || 0, 10) * 10000) + (parseInt(p2 || 0, 10) * 100) + (parseInt(p3 || 0, 10));
    }
    _vArr = getVer();
    if(_vArr) _vC = _num(_vArr[0], _vArr[1], _vArr[2]);
    console.log("vC: "+_vC);
    function verLT(p1,p2,p3){
        if(! _vC) return null;
        var v = _num(p1,p2,p3);

        if(_vC < v) return true;
        return false
    }
    function verGT(p1,p2,p3){
        if(! _vC) return null;
        var v = _num(p1,p2,p3);

        if(_vC > v) return true;
        return false
    }
    function verEq(p1,p2,p3){
        if(! _vC) return null;
        var v = _num(p1,p2,p3);

        if(_vC == v) return true;
        return false
    }
    function verEqGT(p1,p2,p3){
        if(verGT(p1,p2,p3) || verEq(p1,p2,p3)) return true;

        return false;
    }
    function verEqLT(p1,p2,p3){
        if(verLT(p1,p2,p3) || verEq(p1,p2,p3)) return true;

        return false;
    }    
    return{
        isAndroid: isAndroid,
        isIOS: isIOS,
        isWP: isWP,
        isOther: isOther,
        ver:_vC,
        verLT: verLT,
        verGT: verGT,
        verEq: verEq,
        verEqGT: verEqGT,
        verEqLT: verEqLT
    }
})();

var st_useParse = null;
function useParse() { //Enhanced UI
	return false; // mod new
    if(st_useParse !== null){
        return st_useParse;
    }
    if(!Agent.isAndroid || !Agent.ver || Agent.verEqGT(4,4) ){
        st_useParse = false;
    }
    else{
        st_useParse = true;
    }
    return st_useParse;
}

var st_useESels = null;
function useESels() { //Enhanced Sels
	return true; //mod new
    if(st_useESels !== null){
        return st_useESels;
    }
    if(Agent.ver && (Agent.isIOS || (Agent.isAndroid && Agent.verEqGT(4,2)) ) ){
        st_useESels = true;
    }
    else{
        st_useESels = false;
    }
    return st_useESels;
}

var st_useTransition = null;
function useTransition() {
	return true; // mod new
    if(st_useTransition !== null){
        return st_useTransition;
    }
    if(!Agent.isAndroid || !Agent.ver || Agent.verEqGT(5,1) ){
        st_useTransition = true;
    }
    else{
        st_useTransition = false;
    }
    return st_useTransition;


}
var st_useHW = null;
function useHW() {
	return true; //mod new
    if(st_useHW !== null){
        return st_useHW;
    }
    if(!Agent.isAndroid || !Agent.ver || Agent.verEqGT(4) ){
        st_useHW = true;
    }
    else{
        st_useHW = false;
    }
    return st_useHW;
}
var st_applyAnd4Fix = null;
function applyAnd4Fix() {
	return false; // mod new
    if(st_applyAnd4Fix !== null){
        return st_applyAnd4Fix;
    }
    if(Agent.isAndroid && Agent.ver && Agent.verEqGT(4) ){
        st_applyAnd4Fix = true;
    }
    else{
        st_applyAnd4Fix = false;
    }
    return st_applyAnd4Fix;
}
