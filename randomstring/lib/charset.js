function Charset() {
  this.chars = '';
}

Charset.prototype.setType = function(type) {
  if (Array.isArray(type)) {
    for (var i=0; i < type.length; i++) {
      this.chars += this.getCharacters(type[i]);
    }
  }
  else {
    this.chars = this.getCharacters(type);
  }
}

Charset.prototype.getCharacters = function(type) {
  var chars;

  var numbers     = '0123456789';
  var charsLower  = 'abcdefghijklmnopqrstuvwxyz';
  var charsUpper  = charsLower.toUpperCase();
  var hexChars    = 'abcdef';
  var binaryChars = '01';
  var octalChars  = '01234567';

  if (type === 'alphanumeric') {
    chars = numbers + charsLower + charsUpper;
  }
  else if (type === 'numeric') {
    chars = numbers;
  }
  else if (type === 'alphabetic') {
    chars = charsLower + charsUpper;
  }
  else if (type === 'hex') {
    chars = numbers + hexChars;
  }
  else if (type === 'binary') {
    chars = binaryChars;
  }
  else if (type === 'octal') {
    chars = octalChars;
  }
  else {
    chars = type;
  }

  return chars;
}

Charset.prototype.removeUnreadable = function() {
  var unreadableChars = /[0OIl]/g;
  this.chars = this.chars.replace(unreadableChars, '');
}

Charset.prototype.setcapitalization = function(capitalization) {
  if (capitalization === 'uppercase') {
    this.chars = this.chars.toUpperCase();
  }
  else if (capitalization === 'lowercase') {
    this.chars = this.chars.toLowerCase();
  }
}

Charset.prototype.removeDuplicates = function() {
  var charMap = this.chars.split('');
  charMap = [...new Set(charMap)];
  this.chars = charMap.join('');
}

module.exports = exports = Charset;
