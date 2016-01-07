
export function linkedStoreMixin(Store, fetchStateMethodName, stateKeyName) {
  return {
    applyCurrentState: function() {
      this.setState(this.getCurrentState())
    },
    getInitialState: function() {
      return this.getCurrentState();
    },
    getCurrentState: function(){
      return { [stateKeyName] : Store[fetchStateMethodName]() };
    },
    componentWillMount: function () {
      Store.addChangeListener(this.applyCurrentState);
    },
    componentWillUnmount: function () {
      Store.removeChangeListener(this.applyCurrentState);
    },
    componentDidMount: function() {
      this.applyCurrentState();
    }
  }
}