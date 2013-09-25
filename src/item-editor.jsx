/** @jsx React.DOM */
(function(Perseus) {

var Editor = Perseus.Editor;

var HintEditor = Perseus.HintEditor;

var AnswerAreaEditor = React.createClass({
    getDefaultProps: function() {
        return {
            type: "input-number",
            options: {},
            calculator: false
        };
    },

    render: function() {
        var cls;
        if (this.props.type === "multiple") {
            cls = Editor;
        } else {
            cls = Perseus.Widgets._widgetTypes[this.props.type + "-editor"];
        }

        var editor = cls(_.extend({
            ref: "editor",
            onChange: function(newProps, cb) {
                var options = _.extend({}, this.props.options, newProps);
                this.props.onChange({options: options}, cb);
            }.bind(this)
        }, this.props.options));

        return <div className="perseus-answer-editor">
            <div><label>
                Show calculator:
                <input type="checkbox" checked={this.props.calculator}
                    onChange={function(e) {
                        this.props.onChange({calculator: e.target.checked});
                    }.bind(this)} />
            </label></div>
            <div><label>
                Answer type:
                <select value={this.props.type}
                        onChange={function(e) {
                            this.props.onChange({
                                type: e.target.value,
                                options: {}
                            }, function() {
                                this.refs.editor.focus();
                            }.bind(this));
                        }.bind(this)}>
                    <option value="radio">Multiple choice</option>
                    <option value="table">Table of values</option>
                    <option value="input-number">Text input (number)</option>
                    <option value="expression">Expression / Equation</option>
                    <option value="multiple">Custom format</option>
                </select>
            </label></div>
            {editor}
        </div>;
    },

    toJSON: function(skipValidation) {
        // Could be just _.pick(this.props, "type", "options"); but validation!
        return {
            type: this.props.type,
            options: this.refs.editor.toJSON(skipValidation),
            calculator: this.props.calculator
        };
    }
});

var ItemEditor = Perseus.ItemEditor = React.createClass({
    defaultState: {
        question: {},
        answerArea: {},
        hints: []
    },

    getDefaultProps: function() {
        return {
            onChange: function() {}
        };
    },

    getInitialState: function() {
        var props = _.pick(this.props, _.keys(this.defaultState));
        return _.defaults(props, this.defaultState);
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState(_.pick(nextProps, _.keys(this.defaultState)));
    },

    componentDidUpdate: function(prevProps, prevState, rootNode) {
        if (!_.isEqual(prevState, this.state)) {
            this.props.onChange();
        }
    },

    componentDidMount: function() {
        this.props.onChange();
    },

    render: function() {
        return <div className="perseus-item-editor">
            {Editor(_.extend({
                ref: "questionEditor",
                className: "perseus-question-editor",
                onChange: function(newProps, cb) {
                    var question = _.extend({}, this.state.question, newProps);
                    this.setState({question: question}, cb);
                }.bind(this)
            }, this.state.question))}

            {AnswerAreaEditor(_.extend({
                ref: "answerAreaEditor",
                onChange: function(newProps, cb) {
                    var answerArea = _.extend({}, this.state.answerArea,
                            newProps);
                    this.setState({answerArea: answerArea}, cb);
                }.bind(this)
            }, this.state.answerArea))}

            {this.state.hints.map(function(hint, i) {
                return HintEditor(_.extend({
                    key: "hintEditor" + i,
                    ref: "hintEditor" + i,
                    isFirst: i === 0,
                    isLast: i === this.state.hints.length - 1,
                    onChange: function(newProps, cb) {
                        var hints = _.clone(this.state.hints);
                        hints[i] = _.extend({}, this.state.hints[i],
                                newProps);
                        this.setState({hints: hints}, cb);
                    }.bind(this),
                    onRemove: function() {
                        var hints = _.clone(this.state.hints);
                        hints.splice(i, 1);
                        this.setState({hints: hints});
                    }.bind(this),
                    onMove: function(dir) {
                        var hints = _.clone(this.state.hints);
                        var hint = hints.splice(i, 1)[0];
                        hints.splice(i + dir, 0, hint);
                        this.setState({hints: hints}, function() {
                            this.refs["hintEditor" + (i + dir)].focus();
                        });
                    }.bind(this)
                }, hint));
            }, this)}

            <div className="add-hint-container">
                <a href="#" className="simple-button orange"
                        onClick={this.addHint}>
                    <span className="icon-plus" />
                    Add a hint
                </a>
            </div>
        </div>;
    },

    addHint: function() {
        var hints = this.state.hints.concat([{}]);
        var i = hints.length - 1;

        this.setState({hints: hints}, function() {
            this.refs["hintEditor" + i].focus();
        }.bind(this));
        return false;
    },

    toJSON: function(skipValidation) {
        return {
            question: this.refs.questionEditor.toJSON(skipValidation),
            answerArea: this.refs.answerAreaEditor.toJSON(skipValidation),
            hints: this.state.hints.map(function(hint, i) {
                return this.refs["hintEditor" + i].toJSON(skipValidation);
            }, this)
        };
    },

    focus: function() {
        this.questionEditor.focus();
    }
});

})(Perseus);