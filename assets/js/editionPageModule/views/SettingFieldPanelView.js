define([
    'jquery',
    'marionette',
    'text!../templates/SettingFieldPanelView.html',
    'backbone.radio',
    '../../Translater',
    'sweetalert',
    'app-config',
    './loaders/ContextLoader',
    'jquery-ui',
    'i18n',
    'bootstrap-select',
    'slimScroll',
    'bootstrap'
], function($, Marionette, SettingPanelViewTemplate, Radio, Translater, swal, AppConfig, ContextLoader) {

    var translater = Translater.getTranslater();

    /**
     * Setting view
     * This view display form (generated with backbone-forms) to edit form or field properties
     *
     * See collection/FieldCollection to see form schema
     * See models/Fields to see form schema for each field type like text field, number, etc ...
     */
    var SettingFieldPanelView = Backbone.Marionette.ItemView.extend({


        /**
        * jQuery event triggered by the view
        * @type {Object}
        */
        events : {
            'change #getField select'     : 'selectChanged',
            'click #cancel'               : 'cancel',
            'click #saveChange'           : 'saveChange',
            'click #saveButton'           : 'saveField',
            'click #applyTemplateButton'  : 'applyTemplateField',
            'change .checkboxField input' : 'checkboxChange',
            'change .form-control'        : 'formControlChange',
            'click #myTabs a' : function(e) {
                e.preventDefault();
                $(this).tab('show');
            }
        },


        /**
        * Setting view template initialization
        */
        template : function() {
            if (this.modelToEdit)
            {
                return _.template(SettingPanelViewTemplate)({
                    model : this.modelToEdit,
                    type : this.modelToEdit.constructor.type.charAt(0).toLowerCase() + this.modelToEdit.constructor.type.slice(1)
                });
            }
            return ({model: undefined, type:  undefined});
        },


        /**
        * View constructor, init grid channel
        */
        initialize : function(options) {
            this.fieldsList             = options.fieldsList;
            this.URLOptions             = options.URLOptions;
            this.modelToEdit            = options.modelToEdit;
            this.linkedFieldsList       = options.linkedFieldsList[window.context];
            this.preConfiguredFieldList = options.preConfiguredFieldList;

            this.form               = null;
            this.fieldWithSameType  = null;

            this.subSettingView = null;

            this.hasFieldsChanged = false;

            //  Init backbone radio channel
            this.initFormChannel();
            this.initMainChannel();
            this.initHookChannel();
            this.initGlobalChannel();

            _.bindAll(this, 'template', 'initForm');
        },

        initHookChannel : function() {
            this.hookChannel = Backbone.Radio.channel('hook');
        },


        /**
        * Init main radio channel for communicate in the editionPageModule
        */
        initMainChannel : function() {
            //  The edition channel is the main channel ONLY in the editionPageModule
            this.mainChannel = Backbone.Radio.channel('edition');
        },

        initGlobalChannel : function() {
            this.globalChannel = Backbone.Radio.channel('global');
        },


        /**
         * Init form channel
         * This channel concerns only form functionnality like create a form to edit model
         */
        initFormChannel : function() {
            //  The form channel is used only for the main form object options
            //  save, export, clear and settings
            this.formChannel = Backbone.Radio.channel('form');

            //  Event send by EditionPageController when the field has been good saved as pre configurated field
            this.formChannel.on('configurationSaved:success', this.displayConfigurationSaveSuccess, this);
            //  Same thing when an error occured on saved
            this.formChannel.on('configurationSaved:fail', this.displayConfigurationSaveFail, this);
        },


        /**
        * Create a form to edit field properties
        *
        * @param  {Object} field Field with which backbone forms will generate an edition form
        */
        initForm : function() {

            this.currentFieldType  = this.modelToEdit.constructor.type;
            this.fieldWithSameType = this.preConfiguredFieldList[this.currentFieldType];

            if (this.fieldWithSameType == undefined) {
                this.$el.find('*[data-setting="field"]').first().hide();
            } else {
                // Update available pre configurated field
                _.each(this.fieldWithSameType, _.bind(function(el, idx) {
                    this.$el.find('#getField select').append('<option value="' + idx + '">' + idx + '</option>');
                }, this));
            }

            this.$el.find('select').selectpicker();

            this.createForm();
        },

        initContextDatas : function() {

            // TODO Idealy, this should be in the contextloaders ...
            //  Init linked field
            this.initFormLinkedFields();
            ContextLoader.initializeLoader(this.form, this.URLOptions, true);
        },

        /**
         * Enable or disable linked field select if the checkbox is checked or not
         */
        bindLinkedFieldSelect : function() {
            this.form.fields.isLinkedField.editor.$el.find('input').change(_.bind(function(e) {
                this.disableOrEnableLinkedFields($(e.target).is(':checked'));
            }, this));
        },

        /**
         * Disable or enable linked field select
         *
         * @param state if the select will be checked or not
         */
        disableOrEnableLinkedFields : function(state) {
            if (state)
            {
                this.modelToEdit.set("isLinkedField", true);
                this.form.fields.linkedField.$el.removeClass('hide');
                this.form.fields.linkedField.$el.animate({opacity: 1}, 300);
                this.form.fields.linkedFieldTable.$el.removeClass('hide');
                this.form.fields.linkedFieldTable.$el.animate({opacity: 1}, 300);
                this.form.fields.linkedFieldIdentifyingColumn.$el.removeClass('hide');
                this.form.fields.linkedFieldIdentifyingColumn.$el.animate({opacity: 1}, 300);
            }
            else
            {
                var that = this;
                this.form.fields.linkedField.$el.animate({opacity: 0}, 300, function(){
                    that.form.fields.linkedField.$el.addClass('hide')});
                this.form.fields.linkedFieldTable.$el.animate({opacity: 0}, 300, function(){
                    that.form.fields.linkedFieldTable.$el.addClass('hide')});
                this.form.fields.linkedFieldIdentifyingColumn.$el.animate({opacity: 0}, 300, function(){
                    that.form.fields.linkedFieldIdentifyingColumn.$el.addClass('hide')});
            }
        },

        /**
         * Enable or disable linked field select if the checkbox is checked or not
         */
        bindCssEditorsSelect : function() {
            this.form.fields.showCssProperties.editor.$el.find('input').change(_.bind(function(e) {
                this.disableOrEnableCssEditionFields($(e.target).is(':checked'));
            }, this));
        },

        /**
         * Disable or enable linked field select
         *
         * @param state if the select will be checked or not
         */
        disableOrEnableCssEditionFields : function(state) {
            if (state)
            {
                this.form.fields.editorClass.$el.removeClass('hide');
                this.form.fields.editorClass.$el.animate({opacity: 1}, 300);
                this.form.fields.fieldClassEdit.$el.removeClass('hide');
                this.form.fields.fieldClassEdit.$el.animate({opacity: 1}, 300);
                this.form.fields.fieldClassDisplay.$el.removeClass('hide');
                this.form.fields.fieldClassDisplay.$el.animate({opacity: 1}, 300);
            }
            else
            {
                var that = this;
                this.form.fields.editorClass.$el.animate({opacity: 0}, 300, function(){
                    that.form.fields.editorClass.$el.addClass('hide')});
                this.form.fields.fieldClassEdit.$el.animate({opacity: 0}, 300, function(){
                    that.form.fields.fieldClassEdit.$el.addClass('hide')});
                this.form.fields.fieldClassDisplay.$el.animate({opacity: 0}, 300, function(){
                    that.form.fields.fieldClassDisplay.$el.addClass('hide')});
            }
        },

        /**
         * A field can be linked to another field
         * We initialize select field option
         */
        initFormLinkedFields : function() {
            var linkedFieldsKeyList = [];
            _.each(this.linkedFieldsList.linkedFieldsList, function(el, idx) {
                linkedFieldsKeyList.push(el.key)
            });

            var optionsToShow = {"empty":""};
            $.each(this.preConfiguredFieldList.options, function(key, value){
                optionsToShow[key] = key;
            });
            this.form.fields.applyTemplate.editor.setOptions(optionsToShow);

            if (! _.contains(['Subform'], this.modelToEdit.constructor.type) &&
                ! _.contains(['ChildForm'], this.modelToEdit.constructor.type)) {
                //  Update linked fields
                this.form.fields.linkedField.editor.setOptions(linkedFieldsKeyList);
                this.form.fields.linkedFieldTable.editor.setOptions(this.linkedFieldsList.tablesList);
                this.form.fields.linkedFieldIdentifyingColumn.editor.setOptions(this.linkedFieldsList.identifyingColumns);

                var attr = this.modelToEdit.attributes;
                //  Disable all select at start
                this.disableOrEnableCssEditionFields(false);
                this.disableOrEnableLinkedFields(attr.linkedField && attr.linkedFieldIdentifyingColumn && attr.linkedFieldTable);
                this.bindLinkedFieldSelect();
                this.bindCssEditorsSelect();
            }
        },

        /**
        * Create a form to edit field properties
        *
        * @param  {[Object]} field to edit
        */
        createForm : function() {
            require(['backbone-forms'], _.bind(function() {

                Backbone.Form.validators.errMessages.required = translater.getValueFromKey('form.validation');

                var getJSONFromBinaryWeight = function(binWeight)
                {
                    var toret = {};
                    toret.nullmean = (binWeight >= 8);
                    binWeight %= 8;
                    toret.nullable = (binWeight >= 4);
                    binWeight %= 4;
                    toret.editable = (binWeight >= 2);
                    binWeight %= 2;
                    toret.visible = (binWeight >= 1);
                    return (toret);
                };

                if (this.modelToEdit && this.modelToEdit.attributes.editMode &&
                    this.modelToEdit.attributes.editMode.visible == undefined)
                {
                    this.modelToEdit.set("editMode", getJSONFromBinaryWeight(this.modelToEdit.attributes.editMode));
                }

                this.form = new Backbone.Form({
                    model: this.modelToEdit
                }).render();

                this.initContextDatas();

                this.$el.find('#form').append(this.form.el)

                // Send an event to editionPageLayout to notify that form is created
                this.mainChannel.trigger('formCreated');

                this.form.$el.on('change input[name="decimal"]', _.bind(function(e) {
                    if ($(e.target).is(':checked')) {
                        this.form.$el.find('.field-precision').addClass('advanced');
                    } else {
                        this.form.$el.find('.field-precision').removeClass('advanced');
                    }
                }, this));

                if (_.contains(['Thesaurus', 'AutocompleteTreeView'], this.modelToEdit.constructor.type)) {
                    var WebServiceUrl = $("[name='webServiceURL']").val();

                    if (WebServiceUrl)
                    {
                        if (WebServiceUrl.substring(0,5) == 'http:' ) {
                            $('input[name="defaultNode"]').replaceWith('<div id="defaultNode"></div>');

                            var startID = AppConfig.config.startID[window.context];
                            if (!startID)
                                startID = AppConfig.config.startID.default;
                            $.ajax({
                                data        : JSON.stringify({StartNodeID: startID, lng: "fr"}),
                                type        : 'POST',
                                url         : WebServiceUrl,
                                contentType : 'application/json',
                                //  If you run the server and the back separately but on the same server you need to use crossDomain option
                                //  The server is already configured to used it
                                crossDomain : true,

                                //  Trigger event with ajax result on the formView
                                success: _.bind(function(data) {
                                    $('#defaultNode').fancytree({
                                        source     : data,
                                        checkbox   : false,
                                        selectMode : 1,
                                        activeNode : startID,
                                        click : _.bind(function(event, data) {
                                            this.globalChannel.trigger('nodeSelected' + this.modelToEdit.get('id'), data);
                                            console.log("00**************", event, data);
                                        }, this)
                                    });
                                }, this),
                            });
                        }
                        else {
                            $.getJSON(AppConfig.paths.thesaurusWSPath, _.bind(function(data) {

                                $('input[name="defaultNode"]').replaceWith('<div id="defaultNode"></div>');
                                $('#defaultNode').fancytree({
                                    source: data['d'],
                                    checkbox : false,
                                    selectMode : 1,
                                    click : _.bind(function(event, data) {
                                        this.globalChannel.trigger('nodeSelected' + this.modelToEdit.get('id'), data);
                                        console.log("01**************", event, data);
                                    }, this),
                                });

                            }, this)).error(function(a,b,c) {
                                alert ("can't load ressources !");
                            });
                        }
                    }
                } else if (this.modelToEdit.constructor.type === 'TreeView') {

                     this.setTreeViewConfiguration();

                } else if (_.contains(['Select', 'CheckBox', 'Radio'], this.modelToEdit.constructor.type)) {
                     this.setMultipleFieldConfiguration();
                 }

                this.initScrollBar();

            }, this));
        },

        /**
         * For enumeration field like Checkbox, select ... we used a backgrid to manage values
         * We used the EnumerationView
         *
         * At start we used backbone forms modalAdapter but the generated code is hard to maintain add we prefered a "in-live" modification instead of modal view.
         */
        setMultipleFieldConfiguration : function() {
            require(['editionPageModule/views/SettingViews/EnumerationView'], _.bind(function(EnumarationView) {

                this.$el.find('.setting-tabs').show();

                this.subSettingView = new EnumarationView({
                    el : '#field-values>div',
                    model : this.modelToEdit
                }).render();


            }, this));
        },

        /**
         * Some field like Treeview need to run specific configuration
         */
        setTreeViewConfiguration : function() {
            $('.settings form input[name="defaultNode"]').replaceWith('<div id="defaultNode"></div>');
            $('.settings form #defaultNode').fancytree({
                source: [
                    {title: "Node 1", key: "1"},
                    {title: "Folder 2", key: "2", folder: true, children: [
                        {title: "Node 2.1", key: "3"},
                        {title: "Node 2.2", key: "4"}
                    ]}
                ],
                selectMode : 1,
                click : _.bind(function(event, data) {
                    this.mainChannel.trigger('nodeSelected' + field.get('id'), data);
                    console.log("02**************", event, data);
                }, this)
            });
        },


        /**
         * Remove last form and clean html content
         */
        removeForm : function() {
            //  I know it's bad but it works for the moment ;)
            setTimeout(_.bind(function() {
                this.$el.find('#form').html('');
                this.form.undelegateEvents();
                this.form.$el.removeData().unbind();
                this.form.remove();
                Backbone.View.prototype.remove.call(this.form);

                //  Update scrollBar
                this.$el.find('.scroll').scrollTop(0);
                this.$el.find('.scroll').slimScroll('update');

                this.form = null;
            }, this), 300);
            //  My prefered music for developpement
            //  https://www.youtube.com/watch?v=YKhNbKplIYA
        },


        /**
        * Reset the select element with pre configuration field name
        */
        resetSelect : function() {
            this.$el.find('#getField select').html('<option value="" disabled selected>Select an option</option>');
        },

        /**
        * View rendering callbak
        */
        onRender : function(options) {
            this.$el.i18n();
            this.initForm();
        },

        initScrollBar : function() {
            this.$el.find('.scroll').slimScroll({
                height        : '80%',
                railVisible   : true,
                alwaysVisible : true,
                railColor     : "#111",
                disableFadeOut: true
            });
            this.$el.find('.scroll').slimScroll({scrollTo: "0px"});
            setTimeout(_.bind(function(){
                this.$el.find('.scroll').scrollTop(0);
            }, this), 100);
        },

        /**
        * Event send when user change select value
        * Set value to the current vield
        *
        * @param  {Object} e jQuery event
        */
        selectChanged : function(e) {
            var choice = this.fieldWithSameType[ $(e.target).val() ];

            this.form.setValue(choice)

            if(_.contains(choice['validators'], "required")) {
                this.form.setValue({'required': true});
                this.$el.find('input[name="required"]').prop('checked', true)
            } else {
                this.form.setValue({'required': false});
                this.$el.find('input[name="required"]').prop('checked', false)
            }

            //this.$el.find('input[name="endOfLine"]').prop('checked', choice['endOfLine'] != undefined)
        },


        /**
        * Send an event on form channel when user wants to clear current form
        */
        cancel : function(){

            var self = this;
            var cancelSettingPanel = function(){
                self.removeForm();
                self.mainChannel.trigger('formCancel');
            };

            if (this.hasFieldsChanged){
                swal({
                    title: translater.getValueFromKey('configuration.cancel.yousure') || "Vraiment ?",
                    text: translater.getValueFromKey('configuration.cancel.unsavedchanges') || "Vous avez effectué de changements !",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: translater.getValueFromKey('configuration.cancel.yescancel') || "Oui, quitter !",
                    cancelButtonText: translater.getValueFromKey('configuration.cancel.stay') || "Non, continuer.",
                    closeOnConfirm: false }, function(){cancelSettingPanel();
                    $(".sweet-alert").find("button").trigger("click");});
            }
            else {
                cancelSettingPanel();
            }
        },


        /**
        * Check generated form values and send events if all is good
        */
        saveChange : function() {
            var nameCounter = 0;
            var that = this;
            var savedDefaultNode = this.modelToEdit.get("defaultNode");
            var savedFullpath = this.modelToEdit.get("fullpath");

            $.each(this.modelToEdit.collection.models, function(value, index){
                if (index.attributes.name == $("#form [name='name']").val())
                {
                    if (that.modelToEdit.attributes.name != $("#form [name='name']").val()){
                        nameCounter++;
                    }
                }
            });

            if (nameCounter == 0) {

                if (this.subSettingView !== null) {
                    //  In this case wa have a sub setting view
                    //  This view is used for example to set Checkbox values
                    this.subSettingView.commitValues();
                }

                var commitResult = this.form.commit();
                if (commitResult === undefined) {
                    this.modelToEdit.set("validated", true);

                    // TODO Should test input Type attribute, but Thesaurus type at first creation seems to be undefined
                    // TODO Need to find why to get a proper testing method ...
                    if (this.modelToEdit.attributes.defaultNode != undefined)
                    {
                        this.modelToEdit.set("defaultNode", savedDefaultNode);
                        this.modelToEdit.set("fullpath", savedFullpath);
                    }

                    if (!this.modelToEdit.get('isLinkedField')) {
                        this.modelToEdit.set('linkedField', '');
                        this.modelToEdit.set('linkedFieldIdentifyingColumn', '');
                        this.modelToEdit.set('linkedFieldTable', '');
                    }

                    this.formChannel.trigger('field:change', this.modelToEdit.get('id'));

                    this.mainChannel.trigger('formCommit');
                    this.removeForm();
                }
                else
                {
                    swal(
                        translater.getValueFromKey('modal.save.uncompleteFielderror') || "Erreur",
                        translater.getValueFromKey('modal.save.uncompleteFieldProp') || "Champ obligatoire non renseigné",
                        "error"
                    );
                }
            }
            else {
                swal(
                    translater.getValueFromKey('configuration.save.fail') || "Echec !",
                    translater.getValueFromKey('configuration.save.samename') || "Votre champs ne peut avoir le même nom qu'un autre champ du formulaire",
                    "error"
                )
            }
        },

        /**
        * Save current field as a configuration field
        */
            //TODO
        saveField : function() {
            var formCommitResult = this.form.commit();
            if (formCommitResult) {

                //  If something wrong we move to the first incorrect field
                var offsetTop = $('input[name="' + Object.keys(formCommitResult)[0] + '"]').offset().top;
                this.$el.find('.scroll').scrollTop( offsetTop );
                this.$el.find('.scroll').slimScroll('update');

            } else {
                var formValue = this.form.getValue();
                formValue['type'] = this.currentFieldType;

                this.formChannel.trigger('saveConfiguration', {
                    field : formValue
                });
            }
        },

        applyTemplateField : function() {
            var templateInputName = $("select[name*=applyTemplate]").val();
            templateInputName = $("select[name*=applyTemplate] option[value='" + templateInputName + "']").text();
            if (templateInputName.length > 0){
                $.ajax({
                    data: {},
                    type: 'GET',
                    url: this.URLOptions.fieldConfigurationURL + "/" + templateInputName,
                    contentType: 'application/json',
                    crossDomain: true,
                    success: _.bind(function (data) {
                        var that = this;
                        $.each(data.result, function(key, value){
                            if (that.modelToEdit.attributes[key] != undefined && key != "name" && key != "id")
                            {
                                that.modelToEdit.attributes[key] =  value;
                            }
                        });
                        that.render();
                    }, this),
                    error: _.bind(function (xhr, ajaxOptions, thrownError) {
                        console.log("Ajax Error: " + xhr);
                    }, this)
                });
            }
        },

        /**
        * Change a checkbox state
        */
        checkboxChange : function(e) {
            this.hasFieldsChanged = true;
            $('label[for="' + $(e.target).prop('id') + '"]').toggleClass('selected')
        },

        /**
         * Remember field value has changed
         */
        formControlChange : function(e) {
            this.hasFieldsChanged = true;
        },


        /**
         * Display success message when field has been saved as pre configurated field
         */
        displayConfigurationSaveSuccess : function() {
            swal(
                translater.getValueFromKey('configuration.save.success') || "Sauvé !",
                translater.getValueFromKey('configuration.save.successMsg') || "Votre champs a bien été sauvgeardé",
                "success"
            )
        },

        /**
         * Display en error message when field couldn't be saved
         */
        displayConfigurationSaveFail : function() {
            swal(
                translater.getValueFromKey('configuration.save.fail') || "Echec !",
                translater.getValueFromKey('configuration.save.failMsg') || "Votre champs n'a pas pu être sauvegardé",
                "error"
            )
        }

    });

    return SettingFieldPanelView;

});
