/** @jsx React.DOM */

var React     = require("react");
var RCSS      = require("rcss");
var TeX       = require("react-components/tex");
var clone     = React.addons.cloneWithProps;

var prettyBig = { fontSize: "150%" };
var slightlyBig = { fontSize: "120%" };

var arithmetic = [
    [<span style={slightlyBig}>+</span>, "+"],
    [<span style={prettyBig}>-</span>, "-"],
    [<TeX style={prettyBig}>\times</TeX>, "\\times"],
    [<TeX style={prettyBig}>{"\\frac{x}{y}"}</TeX>, "\\frac"],
    [<TeX>\div</TeX>, "\\div"]
];

var relations = [
    [<TeX>{"="}</TeX>, "\\eq"],
    [<TeX>\neq</TeX>, "\\neq"],
    [<TeX>\leq</TeX>, "\\leq"],
    [<TeX>\geq</TeX>, "\\geq"],
    [<TeX>\lt</TeX>, "\\lt"],
    [<TeX>\gt</TeX>, "\\gt"],
];

var trigStyle = { marginLeft: -4 };
var symbStyle = { fontSize: "130%" };

var trigonometry = [
    [<TeX>\sin</TeX>, "\\sin"],
    [<TeX>\cos</TeX>, "\\cos"],
    [<TeX>\tan</TeX>, "\\tan"],
    [<TeX>\sec</TeX>, "\\sec"],
    [<TeX>\csc</TeX>, "\\csc"],
    [<TeX>\cot</TeX>, "\\cot"],
    [<TeX style={trigStyle}>{"\\sin^{-1}"}</TeX>, "\\sin^{-1}"],
    [<TeX style={trigStyle}>{"\\cos^{-1}"}</TeX>, "\\cos^{-1}"],
    [<TeX style={trigStyle}>{"\\tan^{-1}"}</TeX>, "\\tan^{-1}"],
    [<TeX style={symbStyle}>\theta</TeX>, "\\theta"],
    [<TeX style={symbStyle}>\phi</TeX>, "\\phi"]
];

var prealgebra = [
    [<TeX>{"\\sqrt{x}"}</TeX>, "\\sqrt"],
    // TODO(joel) - how does desmos do this?
    // ["\\sqrt[3]{x}", "\\sqrt[3]{x}"],
    [<TeX style={slightlyBig}>a^b</TeX>, "a^b"],
    [<TeX style={slightlyBig}>\pi</TeX>, "\\pi"]
];

var buttonSets = { arithmetic, relations, trigonometry, prealgebra };

// Math domain color
var borderColor = "#1c758a";

var buttonStyle = {
    display: "block",
    "float": "left",
    width: "35px",
    height: "35px",
    margin: "2px",
    border: `1px solid ${borderColor}`,
    backgroundColor: "white",
    borderRadius: "5px",

    ":hover": {
        cursor: "pointer",
        backgroundColor: "#f0f0f0"
    }
};

RCSS.createClass(buttonStyle);

var TexButtons = React.createClass({
    propTypes: {
        buttonSet: React.PropTypes.string.isRequired,
        onInsert: React.PropTypes.func.isRequired
    },
    render: function() {
        // Note that we clone each button (symbol). This is done because we may
        // render these buttons multiple times in the same page when there are
        // multiple MathInputs.
        //
        // Aside - I tend to not mentally distinguish classes and class
        // instances though clearly the distinction is important in this case.
        // I wonder how many dormant bugs we have because of this.
        var buttons = _(buttonSets[this.props.buttonSet]).map(symbol =>
            <button onClick={() => this.props.onInsert(symbol[1])}
                    className={buttonStyle.className}
                    tabIndex={-1}>
                {clone(symbol[0])}
            </button>
        );

        // key is here to fix what seems like a React bug. Without the key it
        // errors trying to unify two buttons.
        return <div className={this.props.className}
                    key={this.props.buttonSet}>
            {buttons}
        </div>;
    },
    statics: { buttonSets }
});

module.exports = TexButtons;
