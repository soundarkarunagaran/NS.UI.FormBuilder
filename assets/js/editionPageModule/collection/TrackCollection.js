/**
 * Created by David on 22/12/2015.
 */

define([
    'jquery',
    'backbone',
    '../models/fields',
    'backbone.radio',
    '../../Translater',
    '../editor/CheckboxEditor',
    'pillbox-editor',
    'app-config'
], function ($, Backbone, Fields, Radio, Translater, CheckboxEditor, PillboxEditor) {

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

    var TrackExtention = {

        extentionDatas: {},

        schemaExtention: {
            activite : {
                type        : "Select",
                title       : translater.getValueFromKey('form.activite'),
                editorClass : 'form-control',
                template    : fieldTemplate,
                options : [],
                validators  : [{
                    type : 'required',
                    message : translater.getValueFromKey('form.validation')
                }]
            },
            ordre : {
                type        : 'Number',
                title       : translater.getValueFromKey('form.ordre'),
                editorClass : 'form-control',
                template    : fieldTemplate,
                validators  : [{
                    type : 'required'
                }]
            },
            typeIndividus : {
                type        : 'Select',
                title       : translater.getValueFromKey('form.typeIndividus'),
                editorClass : 'form-control',
                template    : fieldTemplate,
                options : [],
                validators  : [{
                    type : 'required'
                }]
            },
            frequence : {
                type        : 'Select',
                title       : translater.getValueFromKey('form.frequence'),
                editorClass : 'form-control',
                template    : fieldTemplate,
                options : [],
                validators  : [{
                    type : 'required'
                }]
            },
            groupe : {
                type        : 'Select',
                title       : translater.getValueFromKey('form.groupe'),
                editorClass : 'form-control',
                template    : fieldTemplate,
                options : []
            },
            actif : {
                type        : 'Select',
                title       : translater.getValueFromKey('form.actif.title'),
                editorClass : 'form-control',
                template    : fieldTemplate,
                options : [
                    {
                        label : translater.getValueFromKey('form.actif.actif'),
                        val : 1
                    },
                    {
                        label : translater.getValueFromKey('form.actif.pasactif'),
                        val : 2
                    }
                ],
                validators  : [{
                    type : 'required'
                }]
            },
            importapressortie : {
                type        : 'Select',
                title       : translater.getValueFromKey('form.importapressortie.title'),
                editorClass : 'form-control',
                template    : fieldTemplate,
                options : [
                    {
                        label : translater.getValueFromKey('form.importapressortie.only'),
                        val : 1
                    },
                    {
                        label : translater.getValueFromKey('form.importapressortie.not'),
                        val : 2
                    }
                ],
                validators  : [{
                    type : 'required'
                }]
            }
        },

        propertiesDefaultValues : {
            activite : "",
            ordre : "",
            typeIndividus : "",
            frequence : "",
            groupe : "",
            actif : "",
            importapressortie : ""
        },

        getExtractedDatas: function(){
            return({
                "Activite":"Activite",
                "Groupe":"Groupe",
                "TypeIndividus":"TypeIndividus",
                "Frequence":"Frequence"
            });
        },

        getSchemaExtention: function(options){
            var toret = {
                activite : {
                    type        : "Select",
                    title       : translater.getValueFromKey('form.activite'),
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    options : [],
                    validators  : [{
                        type : 'required',
                        message : translater.getValueFromKey('form.validation')
                    }]
                },
                ordre : {
                    type        : 'Number',
                    title       : translater.getValueFromKey('form.ordre'),
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    validators  : [{
                        type : 'required'
                    }]
                },
                typeIndividus : {
                    type        : 'Select',
                    title       : translater.getValueFromKey('form.typeIndividus'),
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    options : [],
                    validators  : [{
                        type : 'required'
                    }]
                },
                frequence : {
                    type        : 'Select',
                    title       : translater.getValueFromKey('form.frequence'),
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    options : [],
                    validators  : [{
                        type : 'required'
                    }]
                },
                groupe : {
                    type        : 'Select',
                    title       : translater.getValueFromKey('form.groupe'),
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    options : []
                },
                actif : {
                    type        : 'Select',
                    title       : translater.getValueFromKey('form.actif.title'),
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    options : [
                        {
                            label : translater.getValueFromKey('form.actif.actif'),
                            val : 1
                        },
                        {
                            label : translater.getValueFromKey('form.actif.pasactif'),
                            val : 2
                        }
                    ],
                    validators  : [{
                        type : 'required'
                    }]
                },
                importapressortie : {
                    type        : 'Select',
                    title       : translater.getValueFromKey('form.importapressortie.title'),
                    editorClass : 'form-control',
                    template    : fieldTemplate,
                    options : [
                        {
                            label : translater.getValueFromKey('form.importapressortie.only'),
                            val : 1
                        },
                        {
                            label : translater.getValueFromKey('form.importapressortie.not'),
                            val : 2
                        }
                    ],
                    validators  : [{
                        type : 'required'
                    }]
                }
            };

            if (options)
            {
                this.getTrackDatas(options, this.getExtractedDatas(), this.setSelectValues, toret);
                return (toret);
            }
            return (toret);
        },

        initializeExtention: function (options) {

            this.getTrackDatas(options, this.getExtractedDatas(), this.setSelectValues, this.schemaExtention);

            return(true);
        },

        jsonExtention: function (originalForm) {
            if (originalForm)
            {

            }
            return(this.propertiesDefaultValues);
        },

        updateAttributesExtention: function () {
            return(true);
        },

        setSelectValues: function(datas, schema)
        {
            var getJSONForSelectOptions = function(valuesArray)
            {
                $.each(valuesArray, function(index, value){
                    valuesArray[index] = {label: value, val: value};
                });

                return(valuesArray);
            };

            if (datas)
            {
                $.each(JSON.parse(datas), function(index, value)
                {
                    var values = [];
                    for(var ind in value)
                        values.push(ind);

                    schema[index.substr(0,1).toLowerCase()+index.substr(1)].options = getJSONForSelectOptions(values.sort());
                });
            }

            return (schema);
        },

        getTrackDatas: function (options, datas, callback, schema) {
            var that = this;
            if ($.isEmptyObject(that.extentionDatas))
            {
                $.ajax({
                    data: JSON.stringify({'datas' : datas}),
                    type: 'POST',
                    url: options.URLOptions.track + "/getData",
                    contentType: 'application/json',
                    crossDomain: true,
                    async: false,
                    success: _.bind(function (data) {
                        var schemaToRet = callback(data, schema);
                        that.extentionDatas = data;
                        return(schemaToRet);
                    }, this),
                    error: _.bind(function (xhr, ajaxOptions, thrownError) {
                        console.log("error ! " + xhr);
                    }, this)
                });
            }
            else
            {
                var schemaToRet = callback(that.extentionDatas, schema);
                return (schemaToRet);
            }
        }
    };

    return TrackExtention;
});