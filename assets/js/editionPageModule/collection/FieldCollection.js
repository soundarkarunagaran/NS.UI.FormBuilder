/**
* @fileOverview collection.js
*
* Describe form model for the application
* Inherited from Backbone collection
*
* @author          MICELI Antoine (miceli.antoine@gmail.com)
* @version         1.0
*/

define([
    'jquery',
    'backbone',
    '../models/fields',
    'backbone.radio',
    '../../Translater',
    '../editor/CheckboxEditor',
    'pillbox-editor',
    'app-config',
    './CollectionExtention'
], function ($, Backbone, Fields, Radio, Translater, CheckboxEditor, PillboxEditor, AppConfig, CollectionExtention) {

    var fieldTemplate = _.template('\
        <div class="form-group field-<%= key %>">\
            <label class="control-label" for="<%= editorId %>"><%= title %></label>\
            <div data-editor >\
                <p class="help-block" data-error></p>\
                <p class="help-block"><%= help %></p>\
            </div>\
        </div>\
    ');

    var translater = Translater.getTranslater();
    var extention = CollectionExtention;

    /**
    * Implement form object as a fields collection
    */
    var Form = Backbone.Collection.extend({
        model: Fields.BaseField,
        options: {},

        /**
         * Collection schema for backbone forms generation
         * @type {Object}
         */
        schemaDefinition : {
            name : {
                type        : "Text",
                title       : translater.getValueFromKey('form.name'),
                editorClass : 'form-control',
                template    : fieldTemplate,
                validators  : [{
                    type : 'required',
                    message : translater.getValueFromKey('form.validation')
                }]
            },
            tag : {
                type        : "Text",
                title       : translater.getValueFromKey('form.tag') + ' <i>(' + translater.getValueFromKey('optional') + ')</i>',
                editorClass : 'form-control',
                template    : fieldTemplate
            },
            labelFr   : {
                type        : "Text",
                title       : translater.getValueFromKey('form.label.fr'),
                editorClass : 'form-control',
                template    : fieldTemplate,
                validators  : [{
                    type : 'required',
                    message : translater.getValueFromKey('form.validation')
                }]
            },
            labelEn   : {
                type        : "Text",
                title       : translater.getValueFromKey('form.label.en'),
                editorClass : 'form-control',
                template    : fieldTemplate,
                validators  : [{
                    type : 'required',
                    message : translater.getValueFromKey('form.validation')
                }]
            },
            descriptionFr : {
                type        : "TextArea",
                title       : translater.getValueFromKey('form.description.fr'),
                editorClass : 'form-control',
                template    : fieldTemplate,
                validators  : [{
                    type : 'required',
                    message : translater.getValueFromKey('form.validation')
                }]
            },
            descriptionEn : {
                type        : "TextArea",
                title       : translater.getValueFromKey('form.description.en'),
                editorClass : 'form-control',
                template    : fieldTemplate,
                validators  : [{
                    type : 'required',
                    message : translater.getValueFromKey('form.validation')
                }]
            },
            keywordsFr : {
                type        : PillboxEditor,
                title       : translater.getValueFromKey('form.keywords.fr')
            },
            keywordsEn : {
                type        : PillboxEditor,
                title       : translater.getValueFromKey('form.keywords.en')
            },
            obsolete : {
                type        : CheckboxEditor,
                fieldClass  : "checkBoxEditor",
                title       : translater.getValueFromKey('schema.obsolete')
            },
            propagate : {
                type        : CheckboxEditor,
                fieldClass  : "checkBoxEditor",
                title       : translater.getValueFromKey('schema.propagate')
            },
            context : {
                type        : "Hidden",
                editorClass : 'form-control',
                template    : fieldTemplate
            }
        },

        getDefaultSchema : function (){
            var toret = {
                name : {
                    type        : "Text",
                    title       : translater.getValueFromKey('form.name'),
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    validators  : [{
                        type : 'required',
                        message : translater.getValueFromKey('form.validation')
                    }]
                },
                tag : {
                    type        : "Text",
                    title       : translater.getValueFromKey('form.tag') + ' <i>(' + translater.getValueFromKey('optional') + ')</i>',
                    editorClass : 'form-control',
                    template    : fieldTemplate
                },
                labelFr   : {
                    type        : "Text",
                    title       : translater.getValueFromKey('form.label.fr'),
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    validators  : [{
                        type : 'required',
                        message : translater.getValueFromKey('form.validation')
                    }]
                },
                labelEn   : {
                    type        : "Text",
                    title       : translater.getValueFromKey('form.label.en'),
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    validators  : [{
                        type : 'required',
                        message : translater.getValueFromKey('form.validation')
                    }]
                },
                descriptionEn : {
                    type        : "TextArea",
                    title       : translater.getValueFromKey('form.description.en'),
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    validators  : [{
                        type : 'required',
                        message : translater.getValueFromKey('form.validation')
                    }]
                },
                descriptionFr : {
                    type        : "TextArea",
                    title       : translater.getValueFromKey('form.description.fr'),
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    validators  : [{
                        type : 'required',
                        message : translater.getValueFromKey('form.validation')
                    }]
                },
                keywordsFr : {
                    type        : PillboxEditor,
                    title       : translater.getValueFromKey('form.keywords.fr')
                },
                keywordsEn : {
                    type        : PillboxEditor,
                    title       : translater.getValueFromKey('form.keywords.en')
                },
                obsolete : {
                    type        : CheckboxEditor,
                    fieldClass  : "checkBoxEditor",
                    title       : translater.getValueFromKey('schema.obsolete')
                },
                propagate : {
                    type        : CheckboxEditor,
                    fieldClass  : "checkBoxEditor",
                    title       : translater.getValueFromKey('schema.propagate')
                },
                context : {
                    type        : "Hidden",
                    editorClass : 'form-control',
                    template    : fieldTemplate
                }
            };

            $.extend(toret, extention.getSchemaExtention(this.options));
            return (toret);
        },

        /**
        * Init form collection
        *
        * @param {type} models
        * @param {type} options
        */
        initialize: function (models, options) {

            var that = this;

            if (options.context && options.context != "all")
                setExtention(options.context);

            that.options = options;

            this.schemaDefinition = this.getDefaultSchema();

            $.each(extention.getSchemaExtention(options), function(index, value){
                that.schemaDefinition[index] = value;
            });

            var opt = options || {};

            this.url           = opt.url            || "";
            this.templateURL   = opt.templateURL    || "";

            this.id              = opt.id             || 0;
            this.name            = opt.name           || 'My form';
            this.descriptionFr   = opt.descriptionFr  || "";
            this.descriptionEn   = opt.descriptionEn  || "";
            this.keywordsFr      = opt.keywordsFr     || ["formulaire"];
            this.keywordsEn      = opt.keywordsEn     || ["form"];
            this.labelFr         = opt.labelFr        || "";
            this.labelEn         = opt.labelEn        || "";
            this.tag             = opt.tag            || "";
            this.obsolete        = opt.obsolete       || false;
            this.propagate       = opt.propagate      || false;
            this.context         = opt.context        || "";
            this.isTemplate      = opt.isTemplate     || false;
            this.fieldstodelete  = [];
            this.fieldsexcludedfromdelete = [];
            this.totalAddedElements = 0;
            this.checkedfields = 0;
            this.maxfields = 0;
            this.working = false;

            extention.initializeExtention(options);

            $.each(extention.jsonExtention(), function(index, value){
                that[index] = opt[index] || value || "";
            });

            //  Bind
            _.bindAll(this, 'clearAll', 'getSize', 'addElement', 'addNewElement', 'getJSON', 'getJSONFromModel', 'removeElement');

            this.initFormChannel();
            this.initHookChannel();
        },

        /**
         * Init form channel
         */
        initFormChannel : function() {
            this.formChannel = Backbone.Radio.channel('form');

            //  Event send from BaseView or inherited view when user wants to remove a field
            this.formChannel.on('remove', this.removeElement);

            //  Event send by BaseView or BaseView inherited view for duplicate model
            this.formChannel.on('copyModel', this.copyModel, this);

            //
            //  Field queue events
            //

            //  Event send form formPanelView for add the next field to the collection
            //  See createFieldFromSchema method
            this.formChannel.on('nextField', this.nextField, this);

            //  Next fieldset event send by subFormView
            this.formChannel.on('nextFieldSet', this.triggeredCreateFieldsets2, this);

            //  Event send by SettingFieldPanelView when a field has changed
            this.formChannel.on('field:change', this.fieldChange, this);
        },

        initHookChannel : function() {
            this.hookChannel = Backbone.Radio.channel('hook');
        },

        fieldChange : function(id) {
            this.hookChannel.trigger('field:change', this, this.get('id'));
        },

        /**
         * Duplicate model in the collection
         *
         * @param modelToCloneID model to duplicate ID
         */
        copyModel : function(modelToCloneID) {
            var originModel = this.at(modelToCloneID),
                nameType    = originModel.constructor.type + 'Field'

            this.addElement(nameType, _.omit(originModel.attributes, 'id'), false);
        },

        /**
        * Allow to arrange the collection through model id
        *
        * @param {formBuild.BaseModel} model  model
        * @returns {integer} comparaison between id
        */
        comparator: function (model) {
            return model.get(model.id);
        },

        /**
        * Return collection size
        * @returns {integer} collection size
        */
        getSize: function () {
            return this.length;
        },

        /**
        * Clear form collection
        */
        clearAll: function () {
            this.reset();
        },

        /**
         * Serialize subform field and sub field
         *
         * @param  {object} model subform to serialize
         * @return {object}       subform data serialized
         */
        getFieldsetFromModel: function (model) {
            return {
                legend   : model.get('legend'),
                fields   : model.get('fields'),
                multiple : model.get('multiple'),
                cid      : model.cid,
                order    : model.get('order')
            };
        },

        /**
         * Serialize model data to JSON
         *
         * @param  {Object} model model to serialize
         * @return {object}       model data serialized
         */

        getJSONFromModel: function (model) {
            var subModel = model.getJSON();

            switch (model.constructor.type) {
                case 'CheckBox':
                    subModel['type'] = (model.constructor.type === "CheckBox") ? 'Checkboxes' : model.constructor.type;
                    break;

                default:
                    subModel['type'] = model.constructor.type;
                    break;
            }

            return subModel;
        },

        /**
         * Serialize collection to JSON object
         *
         * @return {object} serialized collection data
         */
        getJSON: function () {
            var getBinaryWeight = function(editModeVal) {
                var toret = editModeVal;
                if (!$.isNumeric(editModeVal))
                {
                    var loop = 1;
                    toret = 0;
                    for (var index in editModeVal) {
                        if(editModeVal[index])
                            toret += loop;
                        loop *= 2;
                    }
                }
                return(toret);
            };

            var json         = {
                //  form properties
                name          : this.name,
                descriptionFr : this.descriptionFr,
                descriptionEn : this.descriptionEn,
                keywordsEn    : this.keywordsEn,
                keywordsFr    : this.keywordsFr,
                labelFr       : this.labelFr,
                labelEn       : this.labelEn,
                tag           : this.tag || "",
                obsolete      : this.obsolete,
                propagate     : this.propagate,
                isTemplate    : this.isTemplate || false,
                context       : this.context,
                //  form inputs
                schema        : {},
                fieldsets     : []
            }, subModel = null;

            var that = this;

            $.each(extention.jsonExtention(that), function(index, value){
                json[index] = that[index];
            });

            this.map(_.bind(function (model) {
                if (model.constructor.type === 'Subform') {
                    json.fieldsets.push(this.getFieldsetFromModel(model));
                } else if (model.constructor.type != undefined) {

                    subModel = this.getJSONFromModel(model);

                    if (json.schema[model.get('name')] !== undefined) {
                        model.set('name', model.get('name') + model.get('id'));
                    }

                    if (model.get('name'))
                        json.schema[model.get('name')] = subModel;
                    else {
                        subModel.parentFormName = json.name;

                        json.schema["childform" + ((Object.keys(json.schema).length + 1) || "1")] = subModel;
                    }
                }
            }, this));

            $.each(json.schema, function(index, inputVal){

                $.each(json.fieldsets, function(index, fieldsetVal){
                    if (inputVal.linkedFieldset != fieldsetVal.legend + " " + fieldsetVal.cid &&
                        $.inArray(inputVal.name, fieldsetVal.fields) != -1){
                        fieldsetVal.fields = $.grep(fieldsetVal.fields, function(value){
                            return value != inputVal.name;
                        });
                    }
                });

                inputVal.editMode = getBinaryWeight(inputVal.editMode);
                inputVal.name = inputVal.name.replace(/\s+/g, '');

                delete (inputVal.applyTemplate);
            });

            return json;
        },

        /**
         * Add field in the form if this is a valid type
         *
         * @param field                 field to add
         * @param ifFieldIsInFieldset   if field in under a fieldset
         * @param newElement            if field is a new element
         */
        addField : function(field, ifFieldIsInFieldset, newElement) {
            this.totalAddedElements++;

            if (this.isAValidFieldType(field.constructor.type)) {
                //  Update field
                field.set('isUnderFieldset', ifFieldIsInFieldset === true);

                if (field.get('id') === 0 || field.get('id') == undefined) {
                    field.set('id', this.totalAddedElements);
                }
                if (field.get('name') == Fields.BaseField.prototype.defaults.name)
                    field.set('name', field.get('name'));

                this.add(field);

                //  Send event when field is added to the form
                this.hookChannel.trigger('field:add', this, field);

                if (ifFieldIsInFieldset) {
                    var fieldset = this.get(field.get('subFormParent'));
                    fieldset.addField(field);

                }

                if (newElement){
                    var scrollArea = $(".dropArea .slimScrollDiv #scrollSection");
                    var lastItemofScrollArea = scrollArea.find('div.dropField:last');

                    if (lastItemofScrollArea.offset()){
                        scrollArea.animate({
                            scrollTop: lastItemofScrollArea.offset().top + lastItemofScrollArea.outerHeight(true) + scrollArea.scrollTop()
                        }, 500);
                    }
                    this.fieldsexcludedfromdelete.push(field.get('id'));
                }

                return field.get('id');
            }
        },

        /**
         * Add a field on the form collection
         *
         * @param {string} nameType
         * @param {object} properties
         * @param {boolean} isUnderFieldset
         */
        addElement: function (nameType, properties, isUnderFieldset) {
            var that = this;
            var field = properties || {};

            // Temporary fix to have the proper order ! I think all elements are added at once and the renderer does not
            // add everything following their order but randomly depending on the loading time of each item ... or so ...
            setTimeout(function(){
                //  We check if the field name is the default name or not (if a form was imported the name can be different but can't be modified)
                // field['name'] = field['name'] == 'Field' ? 'Field' + that.getSize() : field['name'];
                field['order'] = that.getSize();

                //
                //  We add a new file is un the collection
                //  addField return new added field id
                //  addElement return so this id
                //

                return that.addField(new Fields[nameType](field), isUnderFieldset);
            }, 10 * field['order']);
        },

        /**
         * Add a new field on the form collection
         *
         * @param {string} nameType
         * @param {object} properties
         * @param {boolean} isUnderFieldset
         */
        addNewElement: function (nameType, properties, isUnderFieldset) {
            var field = properties || {};
            // field['name']  = field['name'] == 'Field' ? 'Field' + this.getSize() : field['name'];
            field['order'] = this.getSize();

            return this.addField(new Fields[nameType](field), isUnderFieldset, true);
        },

        /**
         * Remove sub field from a subForm
         *
         * @param subFormId sub form to remove id
         */
        destroySubElement : function(subFormId) {
            this.map(function(model, idx) {
                if (model.get('subFormParent') == subFormId) {
                    model.trigger('destroy', model);
                }
            })
        },

        /**
         * Remove element from collection
         *
         * @param  {integer} id model to remove id
         */
        removeElement : function(id) {
            var item = this.get(id);

            if (item !== undefined) {
                //  If the field is a subForm field we remove all subFormField
                if (item.constructor.type == 'Subform') {
                    this.destroySubElement(item.get('id'));
                }

                if (item.get('subFormParent') !== undefined) {
                    var fieldSet = this.get(item.get('subFormParent'));
                    fieldSet.removeField(item.get('name'));
                }

                this.hookChannel.trigger('field:remove', this, item);

                //  We used trigger instead destroy method, the DELETE ajax request is not send
                item.trigger('destroy', item);

                if ($.inArray(item.get('id'), this.fieldsexcludedfromdelete) == '-1')
                {
                    this.fieldstodelete.push(item.get('id'));
                }
            }
        },

        /**
         * Update collection : create field and fieldset from JSON data
         *
         * @param  {object} JSONUpdate JSON data
         */
        updateWithJSON : function(JSONUpdate) {
            this.JSONUpdate = JSONUpdate;
            //  Update form attribute
            this.updateCollectionAttributes(JSONUpdate);

            this.triggeredCreateFieldsets2();
        },

        /**
         * Check if the string in parameter is a valid field type
         *
         * @param typeToBeValidated string to test
         * @returns {boolean} if the string is a valid field type
         */
        isAValidFieldType : function(typeToBeValidated) {
            return Fields[typeToBeValidated + 'Field'] !== undefined;
        },

        /**
         * Create a new field with properties in parameter
         *
         * @param {array} newFieldProperties properties array
         */
        createFieldWithJSON : function(newFieldProperties) {
            return new Fields[newFieldProperties['type'] + 'Field'](newFieldProperties);
        },

        /**
         * Update collection attributes
         *
         * @param  {Object} JSONUpdate JSON data
         */
        updateCollectionAttributes : function(JSONUpdate) {

            if (JSONUpdate){
                this.id                   = JSONUpdate['id'] !== undefined ? JSONUpdate['id'] : this.id;
                this.name                 = JSONUpdate["name"];

                this.descriptionFr        = JSONUpdate["descriptionFr"];
                this.descriptionEn        = JSONUpdate["descriptionEn"];

                this.keywordsFr           = JSONUpdate["keywordsFr"];
                this.keywordsEn           = JSONUpdate["keywordsEn"];

                this.labelFr              = JSONUpdate["labelFr"];
                this.labelEn              = JSONUpdate["labelEn"];

                this.tag                  = JSONUpdate["tag"];

                this.obsolete             = JSONUpdate["obsolete"];
                this.propagate            = JSONUpdate["propagate"];

                this.isTemplate           = JSONUpdate["isTemplate"];

                var that = this;
                $.each(extention.jsonExtention(), function(index, value){
                    that[index] = JSONUpdate[index] || value || "";
                });
            }
        },

        triggeredCreateFieldsets : function() {
            var that = this;
            if (that.maxfields == 0)
                that.maxfields = that.JSONUpdate['fieldsets'].length + Object.keys(this.JSONUpdate["schema"]).length;
            if (that.checkedfields != that.maxfields && !this.working)
            {
                this.working = true;
                var ordervalue = 0;
                var checked = false;

                while (that.maxfields != that.checkedfields && ordervalue < 666){
                    checked = false;
                    $.each(that.JSONUpdate['fieldsets'], function(index, value){
                        if (value['order'] == ordervalue)
                        {
                            that.createFieldset(value, index);
                            that.checkedfields++;
                            checked = true;
                            return(false);
                        }
                    });

                    if (!checked){
                        $.each(that.JSONUpdate['schema'], function(index, value){
                            if (value.order == ordervalue)
                            {
                                that.createField2(value, index);
                                that.checkedfields++;
                                checked = true;
                                return(false);
                            }
                        });
                    }
                    ordervalue++;
                }
                this.formChannel.trigger('collectionUpdateFinished');
                this.working = false;
            }
        },

        triggeredCreateFieldsets2 : function() {
            var i = 0;
            var that = this;

            if (!that.working && that.JSONUpdate)
            {
                that.working = true;
                that.schema = [];

                $.each(that.JSONUpdate['fieldsets'], function(index, value) {
                    $.each(that.JSONUpdate["schema"], function(subindex, subvalue){
                        if (subvalue.linkedFieldset == value["refid"])
                        {
                            subvalue.order += 10000;
                            that.schema.push(subvalue);
                            delete that.JSONUpdate["schema"][subindex];
                        }
                    });
                });

                if (that.JSONUpdate['fieldsets'].length > 0){
                    that.JSONUpdate['fieldsets'] = _.sortBy(that.JSONUpdate['fieldsets'], function (el) {
                        return el["order"];
                    });
                }

                if (Object.keys(that.JSONUpdate["schema"]).length > 0){
                    that.JSONUpdate["schema"] = _.sortBy(that.JSONUpdate["schema"], function(el) {
                        return el.order;
                    });
                }

                while (that.JSONUpdate['fieldsets'].length + Object.keys(that.JSONUpdate["schema"]).length > 0){
                    var first;
                    for (var head in that.JSONUpdate["schema"]){ first = head; break;}

                    if (Object.keys(this.JSONUpdate["schema"]).length == 0 ||
                        (that.JSONUpdate['fieldsets'].length > 0 &&
                         that.JSONUpdate['fieldsets'][0]["order"] < that.JSONUpdate["schema"][first].order))
                    {
                        if (that.JSONUpdate['fieldsets'][0]["order"] >= 10000)
                            that.JSONUpdate['fieldsets'].splice(0, 1);
                        else
                        {
                            that.JSONUpdate['fieldsets'][0]["order"] += 10000;
                            that.createFieldset2(that.JSONUpdate['fieldsets'][0]);
                        }
                    }
                    else
                    {
                        that.createField3(that.JSONUpdate["schema"][first]);
                        delete that.JSONUpdate["schema"][first];
                    }
                    i++;

                    if (i > 1000)
                        break;
                }

                this.formChannel.trigger('collectionUpdateFinished');
                that.working = false;
            }
        },

        createField3 : function(fieldObj, fieldType)
        {
            if (fieldObj.type == 'Checkboxes') {
                fieldObj.type = 'CheckBox';
            }

            if (this.isAValidFieldType(fieldObj.type) || this.isAValidFieldType(fieldType)) {
                this.addElement((fieldObj.type || fieldType) + "Field", fieldObj, false);
                //this.addField(this.createFieldWithJSON(fieldObj), fieldObj['isUnderFieldset']);
            }
        },

        /**
         * Create fieldset and sub field from JSON data
         *
         * @param  {Object} JSONUpdate JSON data
         */
        createFieldset2 : function(fieldsetObj) {

            var fieldset = {
                legend   : fieldsetObj['legend'],
                fields   : fieldsetObj['fields'],
                multiple : fieldsetObj['multiple'],
                order    : fieldsetObj['order']
            };

            var subFormID = this.addElement('SubformField', fieldset, false);

            $.each(this.schema, _.bind(function(index, value) {
                if (this.schema && value && value.linkedFieldset == fieldsetObj["refid"]){
                    value['subFormParent'] = subFormID;
                    value['isUnderFieldset'] = true;
                    this.createField3(value);
                    delete this.schema[index];
                }
            }, this));
        },

        /**
         * Create fieldset and sub field from JSON data
         *
         * @param  {Object} JSONUpdate JSON data
         */
        createFieldset : function(fieldsetObj, fieldsetPosition) {

            var fieldset = {
                legend   : fieldsetObj['legend'],
                fields   : fieldsetObj['fields'],
                multiple : fieldsetObj['multiple'],
                order    : fieldsetObj['order']
            };

            var subFormID = this.addElement('SubformField', fieldset, false);

            $.each(fieldset['fields'], _.bind(function(index, value) {
                var fieldObj = this.JSONUpdate['schema'][index];
                fieldObj['subFormParent'] = subFormID;
                fieldObj['isUnderFieldset'] = true;
                this.createField(value, index);
            }, this));

            this.JSONUpdate['fieldsets'].splice(fieldsetPosition, 1);
        },


        createField2 : function(fieldObj, fieldPosition)
        {
            this.schema = [];

            if (fieldObj.type == 'Checkboxes') {
                fieldObj.type = 'CheckBox';
            }

            this.schema.push(fieldObj);

            var fieldToAdd = this.schema[0];

            if (this.isAValidFieldType(fieldToAdd.type)) {
                this.addField(this.createFieldWithJSON(fieldToAdd), fieldToAdd['isUnderFieldset']);
            }

            this.schema.shift();

            delete this.JSONUpdate["schema"][fieldPosition];
        },


        createField : function(fieldObj, fieldPosition)
        {
            if (fieldObj.type == 'Checkboxes') {
                fieldObj.type = 'CheckBox';
            }

            if (this.isAValidFieldType(fieldObj.type)) {
                this.addField(this.createFieldWithJSON(fieldObj), fieldObj['isUnderFieldset']);
            }

            delete this.JSONUpdate["schema"][fieldPosition];
        },


        /**
         * Create all field from JSON schema
         *
         * @param  {Object} JSONUpdate JSON data
         */
        createFieldFromSchema : function(JSONUpdate) {

            this.schema = [];

            //  Convert current schema object in array
            //  We need to convert it in array for sort it by field order
            _.each(JSONUpdate["schema"], _.bind(function(element, index) {
                if (element.type == 'Checkboxes') {
                    element.type = 'CheckBox';
                }
                this.schema.push(element);
            }, this));

            this.schema = _.sortBy(this.schema, function(el) {
                return el.order;
            });

            //  When we add the field on the collection, the form panel listen the event and get the adapted view with requireJS
            //  According to the view weight, the views can be created in a wrong order
            //
            //  E.G : we have a text field and a long text, the text in first and the long at the end
            //  If the requireJS request is too long the Long text could be created before the text
            //
            //  So i create a minimal queue with backbone event
            //  When the view is rendered the formPanelView send an event to the collection "Ok next field" and we add the next field in the collection

            this.nextField();

            //  Now we wait the formPanelview next event
        },

        /**
         * Add the next field on the collection
         */
        nextField : function() {
            if (this.schema != undefined && this.schema.length > 0) {

                var firstFieldToAdd = this.schema[0];

                var copyof = this.schema;
                if (this.isAValidFieldType(firstFieldToAdd.type)) {
                    this.addField( this.createFieldWithJSON(firstFieldToAdd), firstFieldToAdd['isUnderFieldset']);
                }

                this.schema.shift();
            } else {
                this.formChannel.trigger('collectionUpdateFinished');
            }
        },

        /**
         * Return collection attributes values
         * @return [Object} attributes values
         */
        getAttributesValues : function() {
            var result = _.pick(this, _.keys(this.schemaDefinition));

            return result;
        },

        /**
         * Return fields list
         * @param  {[type]} modelID id of field to excluse of the list
         * @return {[Array} list of field
         */
        getFieldList : function(modelID) {
            var fieldsList = [];

            _.each(this.models, function(el, idx) {
                if (el.constructor.type != undefined && el.get('id') != modelID) {
                    fieldsList.push(el.get('name'))
                }
            })

            return fieldsList;
        },

        /**
         * Save collection, send POST or PUT request to the back
         */
        save : function() {
            this.showSpinner();
            var that = this;

            setTimeout(function()
                {
                    if (!that.formChannel)
                        that.initFormChannel();

                    var tmpForm = new Backbone.Form({
                        schema: that.getDefaultSchema(),
                        data: that.getAttributesValues()
                    }).render();

                    var formValidation = tmpForm.validate();

                    var fieldsValidation = true;

                    $.each(that.models, function (index, value) {
                        var fieldModel = that.get(value.id);

                        if (fieldsValidation && !fieldModel.attributes.validated) {
                            var fieldForm = new Backbone.Form({
                                model: that.get(value.id)
                            }).render();
                            if (fieldForm.validate() != null) {
                                fieldsValidation = false;
                            }
                        }
                    });

                    if (formValidation === null && fieldsValidation) {
                        $.each(that.models, function (index, value) {
                            delete that.get(value.id).attributes.validated;
                        });

                        var PostOrPut = that.id > 0 ? 'PUT' : 'POST';
                        var url = that.id > 0 ? (that.url + '/' + that.id) : that.url;

                        $.ajax({
                            data: JSON.stringify(that.getJSON()),
                            type: PostOrPut,
                            url: url,
                            contentType: 'application/json',
                            //  If you run the server and the back separately but on the same server you need to use crossDomain option
                            //  The server is already configured to used it
                            crossDomain: true,

                            //  Trigger event with ajax result on the formView
                            success: _.bind(function (data) {
                                that.id = data.form.id;
                                var savedid = that.id;
                                if (data.form.schema) {
                                    $.each(data.form.schema, function (index, inputVal) {
                                        $.each(that.models, function (modelindex, modelinputVal) {
                                            if (modelinputVal.attributes.name == index) {
                                                that.models[modelindex].set('id', inputVal.id);
                                            }
                                        });
                                    });
                                }

                                var savedFieldsToDelete = that.fieldstodelete;
                                that.fieldstodelete = [];

                                $.each(savedFieldsToDelete, function (index, inputVal) {
                                    $.ajax({
                                        data: {},
                                        type: 'DELETE',
                                        url: that.url + "/" + savedid + "/field/" + inputVal,
                                        contentType: 'application/json',
                                        crossDomain: true,
                                        success: _.bind(function (data) {
                                        }, that),
                                        error: _.bind(function (xhr, ajaxOptions, thrownError) {
                                            that.fieldstodelete.push(inputVal);
                                            that.formChannel.trigger('save:fail');
                                        }, that)
                                    });
                                });

                                that.fieldsexcludedfromdelete = [];

                                var displaySaveSuccess = function(){
                                    setTimeout(function () {
                                        if (that.fieldstodelete.length == 0) {
                                            that.formChannel.trigger('save:success');
                                            that.showSpinner(true);
                                        }
                                        else
                                            displaySaveSuccess();
                                    }, 100);
                                };

                                displaySaveSuccess();

                            }, that),
                            error: _.bind(function (xhr, ajaxOptions, thrownError) {
                                if (xhr.responseText.indexOf("customerror") > -1)
                                    that.formChannel.trigger('save:fail', xhr.responseText.split("::")[1], xhr.responseText.split("::")[2]);
                                else
                                    that.formChannel.trigger('save:fail');
                                that.showSpinner(true);
                            }, that)
                        });
                    }
                    else {
                        if (formValidation != null)
                            that.formChannel.trigger('save:formIncomplete');
                        else if (!fieldsValidation)
                            that.formChannel.trigger('save:fieldIncomplete');
                        that.showSpinner(true);
                    }
                }
            , 10);
        },

        saveAsTemplate : function() {

            $.ajax({
                data        : JSON.stringify(this.getJSON()),
                type        : 'POST',
                url         : this.templateURL,
                contentType : 'application/json',
                //  If you run the server and the back separately but on the same server you need to use crossDomain option
                //  The server is already configured to used it
                crossDomain : true,

                //  Trigger event with ajax result on the formView
                success: _.bind(function(data) {
                    this.formChannel.trigger('template:success');
                }, this),
                error: _.bind(function() {
                    this.formChannel.trigger('fail:success');
                }, this)
            });
        },

        showSpinner : function(hide) {
            console.log("bite !!!");
            if (hide)
            {
                $(".saveSpinner").hide();
                $("#save").show();
            }
            else
            {
                $(".saveSpinner").show();
                $("#save").hide();
            }
        }
    });

    var setExtention = function(extentionToSet){
        var context = extentionToSet || window.context || $("#contextSwitcher .selectedContext").text();
        if (context.toLowerCase() != "all")
            extention = CollectionExtention.getModeExtention(context);
    };

    return Form;
});
