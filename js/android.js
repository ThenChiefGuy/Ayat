SG = (typeof SG == "undefined")?{} : SG;
_platform_ = "android";
_ver = '4.0.0';
progress_factor = 1;
////////////

var availExtPaths = [
	'/mnt/sdcard/external_sd',
	'/mnt/external_sd',
	'/sdcard/sd',
	'/mnt/sdcard/bpemmctest',//
	'/mnt/sdcard/_externalsd',
	'/mnt/sdcard-ext',
	'/mnt/removable/microsd',
	'/removable/microsd',
	'/mnt/external1',
	'/mnt/extsdcard',
	'/mnt/extsd',
	
	'/storage/sdcard1', //!< Motorola Xoom ////////
    '/storage/extsdcard',  //!< Samsung SGS3
    '/storage/sdcard0/external_sdcard',  // user request
    '/mnt/media_rw/sdcard1',   //!< 4.4.2 on CyanogenMod S3
    '/removable/microsd',          //!< Asus transformer prime   
    '/storage/external_sd',            //!< LG
    '/storage/ext_sd',           //!< HTC One Max
    '/storage/removable/sdcard1'      //!< Sony Xperia Z1
	

];




(function(window, $){
var extPaths="",currActiveWin,currActiveAlert,isMenuOn,isSubmenuOn,isToolsmenuOn,back_freeze = false,
    shouldExt = false, canExt = false, def_shouldext = "no",
    currShowstatus = false, def_showstatus = "yes";

var manBack = function(){
	//console.log(backStack);

    if (currActiveWin) {
        try{
            currActiveWin.find(".popup_close").trigger(END_EV);//
        }
        catch(e){}

        return;
    }
    if (currActiveAlert) {
        try{
            currActiveAlert();//
        }
        catch (e) {}
        currActiveAlert = false;

        return;

    }

    
	if(isMenuOn){
		SG.Menu.toggle(-1);
		return;
	} 
	if(isSubmenuOn){
		SG.Menu.hideActiveSub(-1);
		return;
	} 
	if(isToolsmenuOn){
		SG.ToolsMenu.toggle(-1);
		return;
	} 

	if(false && activeDowns){ // removed feature
		if(back_freeze) return;

		if(confirm(_lang['close_app'])){
			back_freeze = true;
			var a = alertt(_lang['close_app_downs'] + '<p><button id="bu_exitApp">'+_lang['bu_exitApp']+'</button> <button id="bu_closeApp">'+_lang['bu_closeApp']+'</button></p>');
			a.hideBu();
			
			$("#bu_exitApp").bind(END_EV , function(e){
				e.stopPropagation();
				e.preventDefault();
				SG._ap1.stop();
				navigator.app.exitApp();
			});
			$("#bu_closeApp").bind(END_EV , function(e){
				e.stopPropagation();
				e.preventDefault();
				a.tm();
				back_freeze = false;
				SG.Plugins.Tools.close(function(){},function(){});
			});
		}
				
	}
	else{
		//navigator.app.exitApp();

        navigator.Backbutton.goHome(function() {
          //console.log('success')
        }, function() {
          //console.log('fail')
        });
	}//
	//b.call(window);
}




SG.Initer.postHook2 = function(){
    if(! oldAndroid){
        try{
            SG.Notifier = window.plugin.notification.local;    
        }
        catch(e){};
    }


    SG.Notifier.cancelAll(_emp);
    
    SG.Trig.on("globalPlay",function(){
       SG.Notifier.add({id:100, title:_lang['ayatApp']+' - '+_lang['recitation'], message: _lang['recitation']+' '+_lang['forReciter']+': '+getQareeName(currQaree),icon:'ic_ayat',smallIcon:'ic_ayat',sound:null }); 
    });
    SG.Trig.on("globalStop",function(){
        SG.Notifier.cancel(100,_emp);
    });
    

    if(Agent.verEqLT(4,0,4)){
        $("#mozaker").parents(".menu_item").first().remove();
    }    

    
    SG.Notifier.onclick = function(id,state,j){
        if(id == 100){
            SG.ToolsMenu.toggle(1);
        }
        if(id > 1000 && id < 2000){
            SG.ToolsMenu.toggle(-1);
            SG.Menu.setAltSub('sm_downloadAudio');
            SG.Menu.toggle(1);

        }
        if(id > 2000 && id < 3000){
            SG.ToolsMenu.toggle(-1);
            SG.Menu.setAltSub('sm_downloadImages');
            SG.Menu.toggle(1);

        }
       if(id > 3000 && id < 4000){
            SG.ToolsMenu.toggle(-1);
            SG.Menu.setAltSub('sm_downloadTtarajem');
            SG.Menu.toggle(1);

        }
        
    }

    
    currKeeplight = getKey('curr_keeplight') || def_keeplight;
    currKeepworking = getKey('curr_keepworking') || def_keepworking;
    
    currShowstatus = "yes";//getKey('curr_showstatus') || def_showstatus;
    
    shouldExt = getKey('curr_shouldext_new') || def_shouldext;

    SG.Plugins.Tools.keeplight(currKeeplight);
    
    setTimeout(function(){
        //SG.Plugins.Tools.showstatus(currShowstatus);
    }, 2000);
    
    //SG.Plugins.Tools.keepworking(currKeepworking);

    SG.Menu.setIniter('sm_settings', function (first) {

        if (first) {
            $("#keeplight_yes").on("tapone" + END_BOUND, function (e, el) {
                set_keeplight("yes");
                $("#keeplight_yes,#keeplight_no").removeClass("ay_active");
                $("#keeplight_yes").addClass("ay_active");
            });
            $("#keeplight_no").on("tapone" + END_BOUND, function (e, el) {
                set_keeplight("no");
                $("#keeplight_yes,#keeplight_no").removeClass("ay_active");
                $("#keeplight_no").addClass("ay_active");
            });

            $("#showstatus_yes").on("tapone" + END_BOUND, function (e, el) {
                set_showstatus("yes");
                $("#showstatus_yes,#showstatus_no").removeClass("ay_active");
                $("#showstatus_yes").addClass("ay_active");
            });
            $("#showstatus_no").on("tapone" + END_BOUND, function (e, el) {
                set_showstatus("no");
                $("#showstatus_yes,#showstatus_no").removeClass("ay_active");
                $("#showstatus_no").addClass("ay_active");
            });

            
            $("#shouldext_yes").on("tapone" + END_BOUND, function (e, el) {
                if(set_shouldext("yes")){
                    $("#shouldext_yes,#shouldext_no").removeClass("ay_active");
                    $("#shouldext_yes").addClass("ay_active");
                }
            });
            $("#shouldext_no").on("tapone" + END_BOUND, function (e, el) {
                if(set_shouldext("no")){
                    $("#shouldext_yes,#shouldext_no").removeClass("ay_active");
                    $("#shouldext_no").addClass("ay_active");
                }
            });

            (_extURI) ? $("#shouldext_yes").addClass("ay_active") : $("#shouldext_no").addClass("ay_active");
           
            (currShowstatus == "yes") ? $("#showstatus_yes").addClass("ay_active") : $("#showstatus_no").addClass("ay_active");
            
            (currKeeplight == "yes") ? $("#keeplight_yes").addClass("ay_active") : $("#keeplight_no").addClass("ay_active");
            (currKeepworking == "yes") ? $("#keepworking_yes").addClass("ay_active") : $("#keepworking_no").addClass("ay_active");
            
            
            SG.Naver.attach('sm_settings', 'defaultSet', 300);

        }

    });
    
    
	$(".popup").on("show", function(){
		currActiveWin = $(this);
	});
	$(".popup").on("hide", function(){
		currActiveWin = false;
	});
	
	SG.Trig.on("showMenu" , function(){
		isMenuOn = true;
	});
	SG.Trig.on("hideMenu" , function(){
		isMenuOn = false;
	});

	SG.Trig.on("showSubMenu" , function(){
		isSubmenuOn = true;
	});
	SG.Trig.on("hideSubMenu" , function(){
		isSubmenuOn = false;
	});

	SG.Trig.on("showToolsMenu" , function(){
		isToolsmenuOn = true;
	});
	SG.Trig.on("hideToolsMenu" , function(){
		isToolsmenuOn = false;
	});

    SG.Trig.on("showModal", function (e,$p_alert) {
        currActiveAlert = $p_alert;
    });
    SG.Trig.on("hideModal", function () {
        currActiveAlert = false;
    });

    
	document.addEventListener("menubutton", function(){SG.Menu.toggle()}, false); // @Warn ; move to android.js
	document.addEventListener("backbutton", manBack , false);
	
	prepareExtP();
	
}

function prepareExtP(){
	SG.Plugins.INITP.extP(function(eP){
        //alert(eP);
		if(eP && eP.length > 3){
			
			var recPath = eP;
			if (recPath.substr(recPath.length - 1) == "/") {
				recPath = recPath.substr(0, recPath.length - 1);
			}
			if (recPath.indexOf("://") == -1) {
				recPath = "file://" + recPath;
			}
			if (recPath) {
				window.resolveLocalFileSystemURL(recPath, function(d) {
					createAyatD();
					function createAyatD() {
						d.getDirectory("Ayat", {
							create : true
						}, function() {
							d.getFile("Ayat/.nomedia", {
								create : true
							}, function() {
								createAD();
							}, _emp);

						}, _emp);
					}

					function createAD() {
						d.getDirectory("Ayat/audio", {
							create : true
						}, function() {
							d.getFile("Ayat/audio/.nomedia", {
								create : true
							}, function() {
								delOldCh();
							}, _emp);

						}, _emp);
					}

					function delOldCh() {
						d.getFile("Ayat/audio/c.txt", {
							create : false
						}, function(f) {
							f.remove(mkCh, _emp);
						}, mkCh);
					}

					function mkCh() {
						d.getFile("Ayat/audio/c.txt", {
							create : true
						}, function() {
                            
                            canExt = true;
                            if(shouldExt == "yes"){
                                _extURI = recPath;
                                _extFS = d;
                            }
                            
						}, _emp);
					}

				}, _emp);
			}
			
		}
	},_emp);
}


SG.Plugins = {INITP:{} , Tools:{} , Dloader:{} , DBP:{} , Listen:{}};

	SG.Plugins.INITP = {
		check : function(win,fail,fr) {
			 cordova.exec(win, fail, "InitPlugin", 'check', [fr]);
		},
		extP: function(win,fail){
			cordova.exec(win, fail, "InitPlugin", 'extP', []);
		}
	}
	//
	SG.Plugins.Tools = {
        rate: function () {
            SG.Plugins.Tools.openurl("https://play.google.com/store/apps/details?id=sa.edu.ksu.Ayat");
        },
        share: function(){
            //window.plugins.socialsharing.share(_lang['shareApp_msg'], null, null, null);
            var msg = _lang['shareApp_msg'];
			cordova.exec(_emp, _emp, "InitPlugin", 'send',['',msg]);

        },
        keeplight: function(v){
            cordova.exec(_emp, _emp, "InitPlugin", 'keeplight', [v]);

        },        
        showstatus: function(v){
            cordova.exec(_emp, _emp, "InitPlugin", 'showstatus', [v]);

        },        
        
		openurl : function(url , win , fail) {
			if(! $.isFunction(win)) win = _emp;
			if(! $.isFunction(fail)) fail = _emp;
			//cordova.exec(win, fail, "ToolsPlugin", 'openurl',[url]);
            window.open(url, '_system');//
			
		},//
		close : function(win , fail) {
			cordova.exec(win, fail, "ToolsPlugin", 'close',[]);
		},
		send  : function(subj , msg , win , fail) {
			if(! $.isFunction(win)) win = _emp;
			if(! $.isFunction(fail)) fail = _emp;//
			cordova.exec(win, fail, "InitPlugin", 'send',[subj,msg]);
		},
		copy  : function(txt , win , fail) {//
			if(! $.isFunction(win)) win = _emp;
			if(! $.isFunction(fail)) fail = _emp;
			//cordova.exec(win, fail, "ClipPlugin", 'copy',[txt]);
			cordova.exec(win, fail, "Clipboard", 'copy',[txt]);
		},
 
		mkdirs: function(dir , win , fail){
			cordova.exec(win, fail, "ToolsPlugin", 'mkdirs',[dir]);
		}
	}
	/*----------------------*/
	SG.Plugins.DBP = {
		amaken : function(mosshaf , page , win,fail) {
			function win2(j){
				j = sortAyat(j);
				for(var i in j){
					j[i] = [j[i].split('_')[0] , j[i].split('_')[1]];
				}
				win(j);
			}
	 		cordova.exec(win2, fail, "DBPlugin", 'amaken', [mosshaf, page]);
		},
		search : function(type, phrase , tash , win,fail) {
			var t = (tash)?"1":"0";
            if(type == "id"){
                phrase = "IN("+phrase+")";
            }
            else if(type == "ids"){
                var favsStr = $.trim(phrase);
                var favsArr = favsStr.split(',');

                var inClause = '';
                var tempArr = [];
                while(favsArr.length){
                    if(inClause) inClause += ' OR id ';
                    tempArr = favsArr.splice(0,90);
                    inClause += 'IN ('+tempArr.join(',')+')';
                }
                if (! inClause) inClause = 'IN(0)';
                
                phrase = inClause;
            }
	 		cordova.exec(win, fail, "DBPlugin", 'search', [type, phrase, t]);
		},
		trans : function(db , begin , end , win,fail) {
			var f2 = function(e){
				if(e == 2){
					delFile('Ayat'+'/tarajem/'+db+'.ayt');
				}


				if(navigator.connection.type == Connection.NONE){
					fail();
					return;
				}
				
				var now = Math.round(Date.now()/1000);
				if(missingNoted[db] && (now - missingNoted[db] < 3600)){
					fail();
					return;					
				}
				
				missingNoted[db] = now;

				confirmm('',parseAr(_lang['confirm_download_trans']),parseAr(_lang['direct_read']),parseAr(_lang['download_file']),function(){
					fail();
				}, function(){//
					win('');
					if(currActiveWin){
						currActiveWin.find(".popup_close").trigger(END_EV);
					}
					SG.ToolsMenu.toggle(-1);
					SG.Menu.setAltSub('sm_downloadTtarajem');
					SG.Menu.toggle(1);
					setTimeout(function(){
						
						$("#m_ttarajem").val("tarajem|"+db).change();										
						$("#bu_m_ttarajem").trigger("tapone");
					}, 1200);
					
				});

			}
			function win2(j){
				win(sortAyat(j));

				if(navigator.connection.type == Connection.NONE){
					return;
				}

				
				var now = Math.round(Date.now()/1000);
				if(getKey('checked_'+db) && ( (now - getKey('checked_'+db) ) < 86400) ){
					return;
				}

				var urli = url_interface + "&do=fs&subj=tarajem&param="+db;
				var jxr  = $.get(urli , _emp , 'json');

				jxr.done(function(j){
					if(j && j.s){
						_afs.getFile(_uri + "/Ayat"+'/tarajem/'+db+'.'+res_ext, {creata:false}, function(fE){
							fE.file(function(f){
								setKey('checked_'+db , now);

								if(f.size != j.s){//
									if(confirm(_lang['confirm_update_trans'])){
										if(currActiveWin){
											currActiveWin.find(".popup_close").trigger(END_EV);
										}

										SG.ToolsMenu.toggle(-1);
										SG.Menu.setAltSub('sm_downloadTtarajem');
										SG.Menu.toggle(1);
										setTimeout(function(){
											
											$("#m_ttarajem").val("tarajem|"+db).change();										
											$("#bu_m_ttarajem").trigger("tapone");
										}, 1200);
									}
								}
								
							}, _emp);
						}, _emp);
					}

				});


			}
			cordova.exec(win2, f2, "DBPlugin", 'trans', [db,begin,end]);
		},
		tafsir : function(author , id , win,fail) {
			var f2 = function(e){
				if(e == 2){
					delFile('Ayat'+'/tafasir/'+author+'.ayt');
				}

				if(navigator.connection.type == Connection.NONE){
					fail();
					return;
				}
				

				var now = Math.round(Date.now()/1000);
				if(missingNoted[author] && (now - missingNoted[author] < 3600)){
					fail();
					return;					
				}
				
				missingNoted[author] = now;

				
				confirmm('',parseAr(_lang['confirm_download_tafsir']),parseAr(_lang['direct_read']),parseAr(_lang['download_file']),function(){
					fail();
				}, function(){
					win('');
					if(currActiveWin){
						currActiveWin.find(".popup_close").trigger(END_EV);
					}
					SG.ToolsMenu.toggle(-1);
					SG.Menu.setAltSub('sm_downloadTtarajem');
					SG.Menu.toggle(1);
					setTimeout(function(){
						
						$("#m_ttarajem").val("tafasir|"+author).change();										
						$("#bu_m_ttarajem").trigger("tapone");
					}, 1200);
					
				});
				
				
				
				
			}
			var suraAya = id2aya(id);
			var sura = suraAya.split('_')[0];
			var aya  = suraAya.split('_')[1];
			function win2(j){
				var bayan = j.tafsir;
				var nass_aya = '<div class="tafsir_txt_aya">' + bayan.split('|||')[0] + ' <span class="tafsir_txt_aya_num">['+QuranData.Sura[sura][sura_key] + ' : ' + aya + ']</span> ' + '</div>';
				if(author != 'tafheem' && author != 'russian' && author != 'indonesian'){
		    		var nass_tafsir = '<div class="tafsir_txt_tafsir">'+formatTafsir(bayan.split('|||')[1])+'</div>';
		    	}
		    	else if(author == "indonesian"){
		    		var nass_tafsir = '<div class="tafheem">' + formatTafsir(bayan.split('|||')[1]) + '</div>';
		    	}
		    	else{
		    		var text = formatTafsir(bayan.split('|||')[2]);
		    		var nass_tafsir = '<div class="tafheem"><div class="tafheem_trans">'+bayan.split('|||')[1]+'</div><div class="tafheem_comments">'+text+'</div>';
		    	}
			
				var nass = '<div class="tafsir_txt">' + nass_aya + nass_tafsir + '</div>'

				win(nass);

				if(navigator.connection.type == Connection.NONE){
					return;
				}

				var now = Math.round(Date.now()/1000);
				if(getKey('checked_'+author) && ( (now - getKey('checked_'+author) ) < 86400) ){
					return;
				}


				var urli = url_interface + "&do=fs&subj=tafasir&param="+author;
				var jxr  = $.get(urli , _emp , 'json');
				jxr.done(function(j){
					if(j && j.s){
						_afs.getFile(_uri + "/Ayat"+'/tafasir/'+author+'.'+res_ext, {creata:false}, function(fE){
							fE.file(function(f){
								setKey('checked_'+author , now);

								if(f.size != j.s){//
									if(confirm(_lang['confirm_update_tafsir'])){
										if(currActiveWin){
											currActiveWin.find(".popup_close").trigger(END_EV);
										}
										SG.ToolsMenu.toggle(-1);
										SG.Menu.setAltSub('sm_downloadTtarajem');
										SG.Menu.toggle(1);
										setTimeout(function(){
											
											$("#m_ttarajem").val("tafasir|"+author).change();										
											$("#bu_m_ttarajem").trigger("tapone");
										}, 1200);
									}
								}
								
							}, _emp);
						}, _emp);
					}

				});
				jxr.fail(function(){
					
				});

			}
			cordova.exec(win2, f2, "DBPlugin", 'tafsir', [author,id]);
		}
	}


	SG.Plugins.Listen = { 
		start: function(successCallback, failureCallback) {
			return cordova.exec(    
				successCallback,
				failureCallback,
				'PhoneListener',
				'startMonitoringPhoneState',
				[]); // no arguments required
		},
		stop: function(successCallback, failureCallback) {
			return cordova.exec(    
				successCallback,
				failureCallback,
				'PhoneListener',
				'stopMonitoringPhoneState',
				[]); // no arguments required
		}
	};


    function set_keeplight(yesno) {
        setKey("curr_keeplight", yesno);
        SG.Plugins.Tools.keeplight(yesno);
    }
    function set_showstatus(yesno) {
        setKey("curr_showstatus", yesno);
        SG.Plugins.Tools.showstatus(yesno);
    }

    function set_shouldext(yesno){

        if(yesno == "yes"){
            if(canExt){
                if (confirm(_lang['confirm_restartApp'])) {
                    setKey("curr_shouldext_new","yes");
                    try {

                        //location.reload();
                        //setTimeout(function(){
                            navigator.app.exitApp();
                        //}, 2000);

                    }
                    catch (e) { }
                }
                else{
                    return false;
                }
            }
            else{
                alert(_lang['extsd_nf']);
                return false;
            }
        }

        else{
            if (confirm(_lang['confirm_restartApp'])) {
                setKey("curr_shouldext_new","no");
                try {
                    //location.reload();
                    //setTimeout(function(){
                        navigator.app.exitApp();
                    //}, 2000);
                }
                catch (e) { }
            }
            else{
                return false;
            }
        }
    }

    function set_keepworking(yesno) {
        setKey("curr_keepworking", yesno);
        if (confirm(_lang['confirm_restartApp'])) {
            try {
                navigator.app.exitApp();
            }
            catch (e) { }
        }
    }
    



})(window, $);

SG.setMozaker = function(id){
    var time  = getKey('mozaker_'+id+'_time');    
    var msg   = getKey('mozaker_'+id+'_msg') || '';
    var sound = getKey('mozaker_'+id+'_alert') || null;
    
    if(sound == -1){
        sound = null;
    }
    else if(sound == 1){
        sound = 'TYPE_NOTIFICATION';
    }
    
    if(time != -1){
        
        var timeObj = new Date();
        timeObj.setHours(parseInt(time.split(':')[0],10));
        timeObj.setMinutes(parseInt(time.split(':')[1],10));
        timeObj.setSeconds(0);
        
        var reqT = timeObj.getTime();
        
        var now  = new Date().getTime();
        
        if(now >= reqT){
            timeObj.setTime(reqT+(86400*1000));
        }
        SG.Notifier.add({id:id, date:timeObj, repeat:'daily', title: _lang['ayatApp'], message: msg, icon:'ic_ayat', smallIcon:'ic_ayat', sound:sound });
    }
    else{
        SG.Notifier.cancel(id,_emp);
    }
};
