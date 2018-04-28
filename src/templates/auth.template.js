var TemplateAuth = (function (_TemplateAuth) {
    
    _TemplateAuth.passwordReset = function (user) {
        var CONFIG = Config.get();

        var title = '';
        var text = '';
        var html = '';

        // more data
        var link = (CONFIG.authUrl ? CONFIG.authUrl +'?': 'https://script.google.com/macros/s/'+ CONFIG.backend +'/exec?e=auth/action&');
            link += 'mode=passwordReset';
            link += '&apiKey='+ CONFIG.apiKey;
            link += '&oobCode='+ user._oobCode;

        // title
        title += 'Reset your password for '+ (CONFIG.siteName|| 'Sheetbase App');

        // text
        text += 'Hello'+ (user.displayName ? ' '+ user.displayName: '' ) +', \\n';
        text += 'Here is your password reset link: '+ link +'. \\n';
        text += 'If you did request for password reset, please ignore this email. \\n';
        text += 'Thank you! \\n';
        

        // html
        html += '<p>Hello'+ (user.displayName ? ' '+ user.displayName: '' ) +',</p>';
        html += '<p>Here is your password reset link: <a href="'+ link +'">'+ link +'</a>.</p>';
        html += '<p>If you did request for password reset, please ignore this email.</p>';
        html += '<p>Thank you!</p>';

        return {
            title: title,
            text: text,
            html: html
        };
    }

    return _TemplateAuth;

})(TemplateAuth||{});