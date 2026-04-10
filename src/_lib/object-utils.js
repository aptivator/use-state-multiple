function getValue(o, address) {
  for(let part of address) {
    if(!Object.hasOwn(o, part)) {
      return;
    }

    o = o[part];
  }

  return o;
}

export function getAddressesAndValues(address, value) {
  if(value) {
    if(!Array.isArray(address)) {
      address = address.split('.');
    }

    return [[address, value]];
  }


  return Object.entries(address).map(([address, value]) => {
    address = address.split('.');
    return [address, value];
  });
}

function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function performObjectWrites(o, addressesAndValues) {
  for(var i = 0, {length} = addressesAndValues, valueChanged = false; i < length; i++) {
    let [address, value] = addressesAndValues[i];
    let existingValue = getValue(o, address);

    if(typeof value === 'function') {
      let existingValue = getValue(o, address);
      value = value(existingValue);
    }

    if(existingValue !== value) {
      setValue(o, address, value);
      valueChanged = true;
    }
  }

  return valueChanged;
}

export function setValue(o, address, value) {
  for(var i = 0, lastIndex = address.length - 1; i < lastIndex; i++) {
    let part = address[i];

    if(!isObject(o[part])) {
      o[part] = {};
    }

    o = o[part];
  }

  return (o[address[i]] = value);
}
