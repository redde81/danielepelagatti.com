// Generated by CoffeeScript 1.7.1
(function() {
  var App,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  App = (function() {
    App.prototype.CONTAINER_X = 200;

    App.prototype.SCREEN_WIDTH = window.innerWidth - App.CONTAINER_X;

    App.prototype.SCREEN_HEIGHT = window.innerHeight;

    App.prototype.FLOOR = -50;

    App.prototype.TRANSITION_DURATION = 0.5;

    App.prototype.PAGE_SCALE_MULTIPLIER = 0.1;

    App.prototype.SCENE_SCALE_MULTIPLIER = 100;

    App.prototype.CSS3D_SCALE_MULTIPLIER = 1;

    App.prototype.container = null;

    App.prototype.camera = null;

    App.prototype.scene = null;

    App.prototype.css3DScene = null;

    App.prototype.renderer = null;

    App.prototype.css3dRenderer = null;

    App.prototype.isWebGLCapable = false;

    App.prototype.isCSS3DCapable = false;

    App.prototype.isCanvasCapable = false;

    App.prototype.mouseX = 0;

    App.prototype.mouseY = 0;

    App.prototype.pickMouseX = 0;

    App.prototype.pickMouseY = 0;

    App.prototype.windowHalfX = App.SCREEN_WIDTH / 2;

    App.prototype.windowHalfY = App.SCREEN_HEIGHT / 2;

    App.prototype.projector = null;

    App.prototype.raycaster = null;

    App.prototype.overObject = null;

    App.prototype.excludeFromPicking = ["scene_baked_pPlane1"];

    App.prototype.initialObjectsProperties = {};

    App.prototype.clickedObject = null;

    App.prototype.clickedObjectWPosition = null;

    App.prototype.clickedObjectWRotation = null;

    App.prototype.clickedObjectWScale = null;

    App.prototype.isFocused = false;

    App.prototype.doRender = true;

    App.prototype.pageLanguage = window.PAGE_LANG;

    App.prototype.pagePermalink = window.PAGE_PERMALINK;

    App.prototype.pageDepth = window.PAGE_DEPTH;

    App.prototype.pageBase = window.PAGE_BASE;

    App.prototype.pageId = "";

    App.prototype.config = [];

    App.prototype.allLanguagesConfig = [];

    App.prototype.thisPageConfig = null;

    App.prototype.page3DObjects = {};

    App.prototype.doPicking = true;

    App.prototype.currentHistoryState = {};

    App.prototype.cameraLookAt = new THREE.Vector3(-50, -300, 0);

    App.prototype.htmlMain = null;

    App.prototype.delayID = -1;

    App.prototype.minCameraX = -250;

    App.prototype.maxCameraX = 250;

    App.prototype.minCameraY = -50;

    App.prototype.maxCameraY = 300;

    function App() {
      this.getRelativeLink = __bind(this.getRelativeLink, this);
      this.getUpDirs = __bind(this.getUpDirs, this);
      this.handlePicking = __bind(this.handlePicking, this);
      this.calcPicking = __bind(this.calcPicking, this);
      this.render = __bind(this.render, this);
      this.animate = __bind(this.animate, this);
      this.onMouseMove = __bind(this.onMouseMove, this);
      this.onWindowResize = __bind(this.onWindowResize, this);
      this.getFocusedPagePosition = __bind(this.getFocusedPagePosition, this);
      this.syncCss3dPlaneRotation = __bind(this.syncCss3dPlaneRotation, this);
      this.syncCss3dPlanePosition = __bind(this.syncCss3dPlanePosition, this);
      this.syncCss3dPlaneScale = __bind(this.syncCss3dPlaneScale, this);
      this.unfocus = __bind(this.unfocus, this);
      this.focus = __bind(this.focus, this);
      this.handleFocus = __bind(this.handleFocus, this);
      this.replaceThreeJsMaterial = __bind(this.replaceThreeJsMaterial, this);
      this.sceneLoadCallback = __bind(this.sceneLoadCallback, this);
      this.hideLoading = __bind(this.hideLoading, this);
      this.showLoading = __bind(this.showLoading, this);
      this.setupCSS3DPage = __bind(this.setupCSS3DPage, this);
      this.onTouchEnd = __bind(this.onTouchEnd, this);
      this.onTouchMove = __bind(this.onTouchMove, this);
      this.onTouchStart = __bind(this.onTouchStart, this);
      this.onConfigError = __bind(this.onConfigError, this);
      this.onMenuLinkOut = __bind(this.onMenuLinkOut, this);
      this.handlePushState = __bind(this.handlePushState, this);
      this.on3DSceneMouseClick = __bind(this.on3DSceneMouseClick, this);
      this.onMenuLinkClick = __bind(this.onMenuLinkClick, this);
      this.onMenuLinkOver = __bind(this.onMenuLinkOver, this);
      this.onPopStateChange = __bind(this.onPopStateChange, this);
      this.onCloseClick = __bind(this.onCloseClick, this);
      this.onConfigLoaded = __bind(this.onConfigLoaded, this);
      var isIE11;
      isIE11 = !!window.MSInputMethodContext;
      this.isCSS3DCapable = Modernizr.csstransforms3d && !isIE11;
      this.isWebGLCapable = this.checkWebGL() && Modernizr.webgl;
      this.isPushStateCapable = Modernizr.history;
      if (this.isCSS3DCapable && this.isPushStateCapable && (this.isCanvasCapable || this.isWebGLCapable)) {
        this.htmlMain = $("main");
        ga('send', 'event', 'webgl-test', 'passed');
        TweenMax.to(this.htmlMain, 1, {
          css: {
            opacity: 0
          },
          onComplete: (function(_this) {
            return function(thisPage) {
              _this.showLoading();
              TweenMax.to(_this.htmlMain, 0, {
                css: {
                  opacity: 1
                }
              });
              _this.htmlMain.remove();
              $("body").css("overflow-y", "hidden");
              $.ajax(_this.pageBase + "config.json", {
                success: _this.onConfigLoaded,
                error: _this.onConfigError
              });
              _this.init();
              return _this.animate();
            };
          })(this)
        });
      } else {
        ga('send', 'event', 'webgl-test', 'failed');
      }
    }

    App.prototype.checkWebGL = function() {
      var isStockAndroid, ua;
      ua = navigator.userAgent.toLowerCase();
      isStockAndroid = /android/.test(ua) && !/chrome/.test(ua);
      try {
        return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl') && !isStockAndroid;
      } catch (_error) {
        return false;
      }
    };

    App.prototype.onConfigLoaded = function(data, textStatus, jqXHR) {
      var loader;
      this.allLanguagesConfig = data;
      this.config = data[this.pageLanguage];
      if (this.config == null) {
        throw "Cannot find config for this language";
      }
      loader = new THREE.SceneLoader();
      if (this.isWebGLCapable) {
        loader.load(this.pageBase + "maya/data/scene.json", this.sceneLoadCallback);
      } else {
        loader.load(this.pageBase + "maya/data/scene_canvas.json", this.sceneLoadCallback);
      }
      return null;
    };

    App.prototype.onCloseClick = function() {
      ga('send', 'event', 'close-page-button', 'click');
      return this.unfocus();
    };

    App.prototype.onPopStateChange = function(event) {
      var languageConfig, languageLink, languageLinks, newPath, obj3D, page, projectLink, projectsLinks, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref;
      if (event.originalEvent.state == null) {
        return;
      }
      newPath = event.originalEvent.state.path;
      _ref = this.config;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        page = _ref[_i];
        if (page.link === newPath) {
          this.pageId = page.meta.id;
          this.thisPageConfig = page;
          break;
        }
      }
      this.pageLanguage = this.thisPageConfig.lang;
      this.pagePermalink = this.thisPageConfig.meta.permalink;
      this.pageDepth = this.thisPageConfig.depth;
      this.pageBase = this.thisPageConfig.base;
      document.title = "Daniele Pelagatti - " + this.thisPageConfig.meta.title;
      obj3D = this.page3DObjects[newPath];
      if (this.isFocused) {
        if (this.clickedObject !== obj3D) {
          this.doPicking = false;
          this.overObject = null;
          this.handleFocus();
          if (this.delayID !== -1) {
            clearTimeout(this.delayID);
          }
          this.delayID = _.delay((function(_this) {
            return function() {
              _this.overObject = obj3D;
              _this.isFocused = false;
              _this.handleFocus();
              return _this.doPicking = true;
            };
          })(this), (this.TRANSITION_DURATION * 1000) + 100);
        }
      } else {
        this.overObject = obj3D;
        this.handleFocus();
      }
      languageLinks = $(".languagesMenu").find("a");
      for (_j = 0, _len1 = languageLinks.length; _j < _len1; _j++) {
        languageLink = languageLinks[_j];
        languageConfig = this.allLanguagesConfig[languageLink.id];
        for (_k = 0, _len2 = languageConfig.length; _k < _len2; _k++) {
          page = languageConfig[_k];
          if (page.meta.id === this.pageId) {
            $(languageLink).attr("href", this.getRelativeLink(page.link));
          }
        }
      }
      projectsLinks = $(".projectsMenu").find("a");
      for (_l = 0, _len3 = projectsLinks.length; _l < _len3; _l++) {
        projectLink = projectsLinks[_l];
        if ($(projectLink).attr("permalink") === this.currentHistoryState) {
          $(projectLink).addClass("selected");
        } else {
          $(projectLink).removeClass("selected");
        }
        $(projectLink).attr("href", this.pageBase + this.getRelativeLink($(projectLink).attr("permalink")).substr(1));
      }
      ga('send', 'pageview', this.thisPageConfig.link);
      return null;
    };

    App.prototype.onMenuLinkOver = function(event) {
      var obj3D;
      obj3D = this.page3DObjects[$(event.currentTarget).attr("permalink")];
      this.doPicking = false;
      this.handlePicking(obj3D);
      return null;
    };

    App.prototype.onMenuLinkClick = function(event) {
      event.originalEvent.preventDefault();
      return this.handlePushState($(event.currentTarget).attr("permalink"));
    };

    App.prototype.on3DSceneMouseClick = function(event) {
      this.calcPicking();
      if (this.overObject == null) {
        this.handleFocus();
        ga('send', 'event', '3d-empty-space', 'click');
        return;
      }
      ga('send', 'event', '3d-plane:' + this.overObject.link, 'click');
      return this.handlePushState(this.overObject.link);
    };

    App.prototype.handlePushState = function(path) {
      var stateObj;
      stateObj = {
        path: path
      };
      if (path !== this.currentHistoryState) {
        history.pushState(stateObj, "Title", this.pageBase + path.substr(1));
        this.currentHistoryState = path;
      }
      return this.onPopStateChange({
        originalEvent: {
          state: stateObj
        }
      });
    };

    App.prototype.onMenuLinkOut = function(event) {
      this.doPicking = true;
      return null;
    };

    App.prototype.onConfigError = function(jqXHR, textStatus, errorThrown) {
      throw errorThrown;
    };

    App.prototype.init = function() {
      this.container = $('.javascriptContent');
      this.CONTAINER_X = this.container.position().left;
      this.SCREEN_WIDTH = window.innerWidth - this.CONTAINER_X;
      this.SCREEN_HEIGHT = window.innerHeight;
      this.windowHalfX = this.SCREEN_WIDTH / 2;
      this.windowHalfY = this.SCREEN_HEIGHT / 2;
      this.camera = new THREE.PerspectiveCamera(75, this.SCREEN_WIDTH / this.SCREEN_HEIGHT, 1, 10000);
      this.camera.position.z = 300;
      this.scene = new THREE.Scene();
      this.css3DScene = new THREE.Scene();
      this.css3DScene.scale.set(this.CSS3D_SCALE_MULTIPLIER, this.CSS3D_SCALE_MULTIPLIER, this.CSS3D_SCALE_MULTIPLIER);
      this.css3DScene.updateMatrix();
      if (this.isWebGLCapable) {
        this.renderer = new THREE.WebGLRenderer({
          antialias: true
        });
      } else if (this.isCanvasCapable) {
        this.renderer = new THREE.CanvasRenderer;
      }
      this.renderer.setClearColor(0xffffff, 1);
      this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
      this.renderer.domElement.style.position = "relative";
      $(this.renderer.domElement).addClass("threejs-container");
      this.container.append(this.renderer.domElement);
      this.css3dRenderer = new THREE.CSS3DRenderer();
      this.css3dRenderer.setClearColor(0xffffff);
      this.css3dRenderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
      this.css3dRenderer.domElement.style.position = "absolute";
      this.css3dRenderer.domElement.style.top = "0";
      this.css3dRenderer.domElement.style.left = "0";
      $(this.css3dRenderer.domElement).addClass("css3d-container");
      this.container.append(this.css3dRenderer.domElement);
      this.projector = new THREE.Projector();
      this.raycaster = new THREE.Raycaster();
      $(window).bind('resize', this.onWindowResize);
      this.container.bind('mousemove touchmove touchstart', this.onMouseMove);
      this.container.bind('click touchend', this.on3DSceneMouseClick);
      this.container.bind("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", this.onWindowResize);
      $(".projectsMenu").find("a").mouseover(this.onMenuLinkOver);
      $(".projectsMenu").find("a").mouseout(this.onMenuLinkOut);
      $(".projectsMenu").find("a").click(this.onMenuLinkClick);
      $(".close-page").click(this.onCloseClick);
      $(window).bind("popstate", this.onPopStateChange);
      this.onWindowResize();
      TweenMax.to($(".threejs-container"), 0, {
        css: {
          opacity: 0
        }
      });
      return TweenMax.to($(".css3d-container"), 0, {
        css: {
          opacity: 0
        }
      });
    };

    App.prototype.onTouchStart = function(event) {};

    App.prototype.onTouchMove = function(event) {};

    App.prototype.onTouchEnd = function(event) {};

    App.prototype.setupCSS3DPage = function(pageObj, object, link) {
      var cssObj, rot2;
      pageObj.css({
        opacity: 0,
        display: "none"
      });
      cssObj = new THREE.CSS3DObject(pageObj[0]);
      cssObj.rotation.order = "ZYX";
      cssObj.position.set(object.position.x * this.SCENE_SCALE_MULTIPLIER, object.position.y * this.SCENE_SCALE_MULTIPLIER, object.position.z * this.SCENE_SCALE_MULTIPLIER);
      cssObj.quaternion.set(object.quaternion.x, object.quaternion.y, object.quaternion.z, object.quaternion.w);
      rot2 = new THREE.Quaternion();
      rot2.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
      cssObj.quaternion.multiply(rot2);
      cssObj.scale.set(object.scale.x * this.PAGE_SCALE_MULTIPLIER, object.scale.y * this.PAGE_SCALE_MULTIPLIER, object.scale.z * this.PAGE_SCALE_MULTIPLIER);
      object.page = pageObj;
      object.cssObj = cssObj;
      this.css3DScene.add(cssObj);
      return null;
    };

    App.prototype.showLoading = function() {
      return $("body").spin({
        lines: 8,
        length: 8,
        width: 5,
        radius: 11,
        corners: 1,
        rotate: 0,
        direction: 1,
        color: '#444',
        speed: 1.3,
        trail: 60,
        shadow: true,
        hwaccel: true,
        className: 'spinner',
        zIndex: 2e9,
        top: '50%',
        left: '50%'
      });
    };

    App.prototype.hideLoading = function() {
      return $("body").spin(false);
    };

    App.prototype.sceneLoadCallback = function(result) {
      var objectIndex, thisPage;
      $(".page-container").css({
        display: "none"
      });
      this.colors = paletteGenerator.generate(result.scene.children.length, function(color) {
        var hcl;
        hcl = color.hcl();
        return hcl[0] >= 0 && hcl[0] <= 360 && hcl[1] >= 0 && hcl[1] <= 0.9 && hcl[2] >= 1 && hcl[2] <= 1.5;
      }, false, 50);
      this.colors = paletteGenerator.diffSort(this.colors);
      objectIndex = 0;
      thisPage = null;
      result.scene.traverse((function(_this) {
        return function(object) {
          var container, link;
          object.rotation.order = "ZYX";
          if (object.material != null) {
            if (_this.excludeFromPicking.indexOf(object.name) === -1) {
              _this.initialObjectsProperties[object.name] = {};
              _this.initialObjectsProperties[object.name].position = object.position.clone();
              _this.initialObjectsProperties[object.name].quaternion = object.quaternion.clone();
              _this.initialObjectsProperties[object.name].scale = object.scale.clone();
              if (_this.config[objectIndex] != null) {
                object.config = _this.config[objectIndex];
                _this.page3DObjects[_this.config[objectIndex].link] = object;
                link = object.link = _this.config[objectIndex].link;
                container = $("<div class='object3DContainer' permalink='" + link + "'></div>");
                if (object.config.meta.permalink === _this.pagePermalink || (object.config.meta.permalink === null && _this.pagePermalink === "")) {
                  _this.htmlMain.find("#no-webgl-warning").remove();
                  _this.htmlMain.find(".no-webgl-warning-button").remove();
                  container.append(_this.htmlMain);
                  thisPage = link;
                }
                _this.setupCSS3DPage(container, object, link);
              } else {
                _this.excludeFromPicking.push(object.name);
              }
              objectIndex++;
            }
            if (_this.isWebGLCapable) {
              _this.replaceThreeJsMaterial(object, objectIndex);
              if (object.name !== "scene_baked_pPlane1") {
                object.material.uniforms.fresnelIntensity.value = 1;
              }
            } else {
              object.material = new THREE.MeshBasicMaterial({
                lights: false,
                fog: false,
                shading: THREE.FlatShading,
                map: object.material.map
              });
              object.material.overdraw = true;
            }
            object.material.transparent = true;
            object.material.opacity = 1;
            object.material.side = THREE.DoubleSide;
          }
          if (object.geometry != null) {
            object.geometry.computeFaceNormals();
            object.geometry.computeVertexNormals();
            object.geometry.computeTangents();
            object.geometry.computeBoundingBox();
          }
          return object.updateMatrix();
        };
      })(this));
      this.scene = result.scene;
      this.scene.position.set(0, -450, 0);
      this.css3DScene.position.set(0, -450, 0);
      this.scene.scale.set(this.SCENE_SCALE_MULTIPLIER, this.SCENE_SCALE_MULTIPLIER, this.SCENE_SCALE_MULTIPLIER);
      this.scene.updateMatrix();
      this.css3DScene.updateMatrix();
      this.hideLoading();
      TweenMax.to($(".threejs-container"), 1, {
        css: {
          opacity: 1
        }
      });
      TweenMax.to($(".css3d-container"), 1, {
        css: {
          opacity: 1
        },
        onCompleteParams: [thisPage],
        onCompleteParams: [thisPage],
        onComplete: (function(_this) {
          return function(thisPage) {
            if (thisPage != null) {
              return _this.handlePushState(thisPage);
            }
          };
        })(this)
      });
      return null;
    };

    App.prototype.replaceThreeJsMaterial = function(object, objectIndex) {
      var defines, material, uniforms;
      uniforms = THREE.UniformsUtils.clone(THREE.PlaneShader.uniforms);
      uniforms.color_opacity.value = 0;
      uniforms.opacity.value = 1;
      uniforms.diffuse.value.set(this.colors[objectIndex].rgb[0] / 255, this.colors[objectIndex].rgb[1] / 255, this.colors[objectIndex].rgb[2] / 255);
      uniforms.map.value = object.material.map;
      defines = {};
      defines["USE_MAP"] = "";
      material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        attributes: {},
        vertexShader: THREE.PlaneShader.vertexShader,
        fragmentShader: THREE.PlaneShader.fragmentShader,
        transparent: true,
        lights: false,
        fog: false,
        shading: THREE.FlatShading,
        defines: defines
      });
      return object.material = material;
    };

    App.prototype.handleFocus = function() {
      if (!this.isFocused) {
        if (this.overObject) {
          this.clickedObject = this.overObject;
          this.focus();
        }
      } else {
        if (!this.overObject) {
          this.unfocus();
        }
      }
      return null;
    };

    App.prototype.focus = function() {
      var camRot, newPos, pageIsLoaded, rot2;
      this.isFocused = true;
      pageIsLoaded = this.clickedObject.page.find("main").length > 0;
      if (!pageIsLoaded) {
        this.showLoading();
        $.ajax(this.getRelativeLink(this.clickedObject.page.attr("permalink")), {
          success: (function(_this) {
            return function(data, textStatus, jqXHR) {
              var mainArticle;
              mainArticle = $(data).find("main");
              mainArticle.find("#no-webgl-warning").remove();
              mainArticle.find(".no-webgl-warning-button").remove();
              _this.clickedObject.page.append(mainArticle);
              return _this.focus();
            };
          })(this),
          error: (function(_this) {
            return function(jqXHR, textStatus, errorThrown) {
              return console.error(textStatus);
            };
          })(this)
        });
        return;
      }
      this.hideLoading();
      this.clickedObjectWPosition = this.initialObjectsProperties[this.clickedObject.name].position.clone();
      this.clickedObjectWRotation = this.initialObjectsProperties[this.clickedObject.name].quaternion.clone();
      this.clickedObjectWScale = this.initialObjectsProperties[this.clickedObject.name].scale.clone();
      newPos = this.getFocusedPagePosition();
      this.clickedObject.page.css({
        "pointer-events": "none"
      });
      TweenMax.to(this.clickedObject.position, this.TRANSITION_DURATION, {
        x: newPos.x,
        y: newPos.y,
        z: newPos.z,
        onUpdateParams: [this.clickedObject],
        onUpdate: this.syncCss3dPlanePosition,
        onCompleteParams: [this.clickedObject],
        onComplete: (function(_this) {
          return function(object) {
            object.page.css({
              "pointer-events": ""
            });
            _this.doRender = false;
            _this.syncCss3dPlanePosition(object);
            _this.onWindowResize();
            return _this.render();
          };
        })(this)
      });
      camRot = this.camera.quaternion.clone();
      rot2 = new THREE.Quaternion();
      rot2.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
      camRot.multiply(rot2);
      TweenMax.to(this.clickedObject.quaternion, this.TRANSITION_DURATION, {
        x: camRot.x,
        y: camRot.y,
        z: camRot.z,
        w: camRot.w,
        onUpdateParams: [this.clickedObject],
        onUpdate: this.syncCss3dPlaneRotation,
        onCompleteParams: [this.clickedObject],
        onComplete: this.syncCss3dPlaneRotation
      });
      TweenMax.to(this.clickedObject.scale, this.TRANSITION_DURATION, {
        x: 1,
        y: 1,
        z: 1,
        onUpdateParams: [this.clickedObject],
        onUpdate: this.syncCss3dPlaneScale,
        onCompleteParams: [this.clickedObject],
        onComplete: this.syncCss3dPlaneScale
      });
      if (this.isWebGLCapable) {
        TweenMax.to(this.clickedObject.material.uniforms.opacity, this.TRANSITION_DURATION, {
          value: 0
        });
      } else {
        TweenMax.to(this.clickedObject.material, this.TRANSITION_DURATION, {
          opacity: 0
        });
      }
      this.clickedObject.page.css({
        display: "block"
      });
      TweenMax.to(this.clickedObject.page[0], this.TRANSITION_DURATION, {
        css: {
          opacity: 1
        }
      });
      $(".close-page").show();
      return null;
    };

    App.prototype.unfocus = function() {
      this.doRender = true;
      this.isFocused = false;
      this.animate();
      TweenMax.to(this.clickedObject.position, this.TRANSITION_DURATION, {
        x: this.clickedObjectWPosition.x,
        y: this.clickedObjectWPosition.y,
        z: this.clickedObjectWPosition.z,
        onUpdateParams: [this.clickedObject],
        onUpdate: this.syncCss3dPlanePosition,
        onCompleteParams: [this.clickedObject],
        onComplete: this.syncCss3dPlanePosition
      });
      TweenMax.to(this.clickedObject.quaternion, this.TRANSITION_DURATION, {
        x: this.clickedObjectWRotation.x,
        y: this.clickedObjectWRotation.y,
        z: this.clickedObjectWRotation.z,
        w: this.clickedObjectWRotation.w,
        onUpdateParams: [this.clickedObject],
        onUpdate: this.syncCss3dPlaneRotation,
        onCompleteParams: [this.clickedObject],
        onComplete: this.syncCss3dPlaneRotation
      });
      TweenMax.to(this.clickedObject.scale, this.TRANSITION_DURATION, {
        x: this.clickedObjectWScale.x,
        y: this.clickedObjectWScale.y,
        z: this.clickedObjectWScale.z,
        onUpdateParams: [this.clickedObject],
        onUpdate: this.syncCss3dPlaneScale,
        onCompleteParams: [this.clickedObject],
        onComplete: this.syncCss3dPlaneScale
      });
      if (this.isWebGLCapable) {
        TweenMax.to(this.clickedObject.material.uniforms.opacity, this.TRANSITION_DURATION, {
          value: 1
        });
      } else {
        TweenMax.to(this.clickedObject.material, this.TRANSITION_DURATION, {
          opacity: 1
        });
      }
      TweenMax.to(this.clickedObject.page[0], this.TRANSITION_DURATION, {
        css: {
          opacity: 0
        },
        onComplete: (function(_this) {
          return function() {
            return _this.clickedObject.page.css({
              display: "none"
            });
          };
        })(this)
      });
      $(".close-page").hide();
      return null;
    };

    App.prototype.syncCss3dPlaneScale = function(object) {
      return object.cssObj.scale.set(object.scale.x * this.PAGE_SCALE_MULTIPLIER, object.scale.y * this.PAGE_SCALE_MULTIPLIER, object.scale.z * this.PAGE_SCALE_MULTIPLIER);
    };

    App.prototype.syncCss3dPlanePosition = function(object) {
      return object.cssObj.position.set(object.position.x * this.SCENE_SCALE_MULTIPLIER, object.position.y * this.SCENE_SCALE_MULTIPLIER, object.position.z * this.SCENE_SCALE_MULTIPLIER);
    };

    App.prototype.syncCss3dPlaneRotation = function(object) {
      var rot2;
      object.cssObj.quaternion.set(object.quaternion.x, object.quaternion.y, object.quaternion.z, object.quaternion.w);
      rot2 = new THREE.Quaternion();
      rot2.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
      return object.cssObj.quaternion.multiply(rot2);
    };

    App.prototype.getFocusedPagePosition = function() {
      var forward, newPos, right, rotMat, xDistance, zDistance;
      rotMat = new THREE.Matrix4();
      rotMat.makeRotationFromQuaternion(this.camera.quaternion);
      forward = new THREE.Vector3(0, 0, -1);
      forward.applyMatrix4(rotMat);
      forward.normalize();
      right = new THREE.Vector3(1, 0, 0);
      right.applyMatrix4(rotMat);
      right.normalize();
      zDistance = window.innerHeight * 0.00065;
      xDistance = 0;
      right.multiplyScalar(xDistance);
      forward.multiplyScalar(zDistance);
      newPos = this.camera.position.clone();
      newPos.x -= this.scene.position.x;
      newPos.y -= this.scene.position.y;
      newPos.z -= this.scene.position.z;
      newPos.x /= this.SCENE_SCALE_MULTIPLIER;
      newPos.y /= this.SCENE_SCALE_MULTIPLIER;
      newPos.z /= this.SCENE_SCALE_MULTIPLIER;
      newPos.add(right);
      newPos.add(forward);
      return newPos;
    };

    App.prototype.onWindowResize = function() {
      var pos, _ref, _ref1;
      this.CONTAINER_X = this.container.position().left;
      this.SCREEN_WIDTH = window.innerWidth - this.CONTAINER_X;
      this.SCREEN_HEIGHT = window.innerHeight;
      this.windowHalfX = this.SCREEN_WIDTH / 2;
      this.windowHalfY = this.SCREEN_HEIGHT / 2;
      this.camera.aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
      this.camera.updateProjectionMatrix();
      if ((_ref = this.renderer) != null) {
        _ref.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
      }
      if ((_ref1 = this.css3dRenderer) != null) {
        _ref1.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
      }
      if (this.isFocused) {
        pos = this.getFocusedPagePosition();
        this.clickedObject.position.set(pos.x, pos.y, pos.z);
        this.clickedObject.cssObj.position.set(pos.x * this.SCENE_SCALE_MULTIPLIER, pos.y * this.SCENE_SCALE_MULTIPLIER, pos.z * this.SCENE_SCALE_MULTIPLIER);
      }
      return this.render();
    };

    App.prototype.onMouseMove = function(event) {
      var mx, my, _ref, _ref1, _ref2, _ref3;
      if (!this.isFocused) {
        event.originalEvent.preventDefault();
      }
      mx = event.clientX || ((_ref = event.originalEvent.touches) != null ? (_ref1 = _ref[0]) != null ? _ref1.clientX : void 0 : void 0) || 0;
      my = event.clientY || ((_ref2 = event.originalEvent.touches) != null ? (_ref3 = _ref2[0]) != null ? _ref3.clientY : void 0 : void 0) || 0;
      this.mouseX = (mx - this.CONTAINER_X) - this.windowHalfX;
      this.mouseY = my - this.windowHalfY;
      this.pickMouseX = ((mx - this.CONTAINER_X) / this.SCREEN_WIDTH) * 2 - 1;
      return this.pickMouseY = -(my / this.SCREEN_HEIGHT) * 2 + 1;
    };

    App.prototype.animate = function() {
      this.render();
      if (this.doRender) {
        return requestAnimationFrame(this.animate);
      }
    };

    App.prototype.render = function() {
      var camX, camY, rangeX, rangeY, _ref, _ref1;
      if (!this.isFocused) {
        rangeX = this.maxCameraX - this.minCameraX;
        rangeY = this.maxCameraY - this.minCameraY;
        camX = (this.mouseX * rangeX) / this.SCREEN_WIDTH;
        camY = (-this.mouseY * rangeY) / this.SCREEN_HEIGHT;
        this.camera.position.x += (camX - this.camera.position.x) * 0.05;
        this.camera.position.y += (camY - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.cameraLookAt);
      }
      this.calcPicking();
      if ((_ref = this.renderer) != null) {
        _ref.render(this.scene, this.camera);
      }
      return (_ref1 = this.css3dRenderer) != null ? _ref1.render(this.css3DScene, this.camera) : void 0;
    };

    App.prototype.calcPicking = function() {
      var intersects, vector;
      vector = new THREE.Vector3(this.pickMouseX, this.pickMouseY, 1);
      this.projector.unprojectVector(vector, this.camera);
      this.raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());
      intersects = this.raycaster.intersectObjects(this.scene.children);
      if (this.doPicking) {
        if (intersects.length > 0) {
          this.handlePicking(intersects[0].object);
        } else {
          if (this.overObject && this.isWebGLCapable) {
            TweenMax.to(this.overObject.material.uniforms.color_opacity, 1, {
              value: 0
            });
          }
          this.overObject = null;
        }
      }
      if ((this.overObject != null) && !this.isFocused) {
        return $("body").css('cursor', 'pointer');
      } else {
        return $("body").css('cursor', '');
      }
    };

    App.prototype.handlePicking = function(object) {
      if (this.overObject !== object) {
        if (this.overObject && this.isWebGLCapable) {
          TweenMax.to(this.overObject.material.uniforms.color_opacity, 1, {
            value: 0
          });
        }
        if (this.excludeFromPicking.indexOf(object.name) === -1) {
          this.overObject = object;
          if (this.isWebGLCapable) {
            TweenMax.to(this.overObject.material.uniforms.color_opacity, 1, {
              value: 1
            });
          }
          if (!this.isFocused) {
            return ga('send', 'event', '3d-plane:' + this.overObject.link, 'over');
          }
        } else {
          return this.overObject = null;
        }
      } else {

      }
    };

    App.prototype.getUpDirs = function(howMany) {
      var i, retValue, _i;
      retValue = "";
      for (i = _i = 0; _i < howMany; i = _i += 1) {
        retValue += "../";
      }
      return retValue;
    };

    App.prototype.getRelativeLink = function(objectPermalink) {
      var updirs;
      updirs = this.getUpDirs(this.pageDepth);
      if (this.pageDepth > 0) {
        return updirs.substr(0, updirs.length - 1) + objectPermalink;
      } else {
        return "." + objectPermalink;
      }
    };

    return App;

  })();

  $(document).ready(function() {
    return window.app = new App();
  });

}).call(this);
