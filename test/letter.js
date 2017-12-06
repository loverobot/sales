var letter = {
    len: function(text){
        return text.toString().replace(/\s/g, '').length;
    }
};

module.exports = letter;
