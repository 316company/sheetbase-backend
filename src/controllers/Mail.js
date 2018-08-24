/**
 * Mail Class
 * For mailling
 */
var Mail = (function (_Mail) {

    _Mail.send = function (mailData, transporter) {
        if(!mailData) return AppError.client(
            'mail/no-mail-data',
            'No mail data!'
        );

        if(!mailData.recipient) return AppError.client(
            'mail/no-recipient',
            'No recipient!'
        );
    
        try {
            (transporter === 'mailapp' ? MailApp: GmailApp).sendEmail(
                mailData.recipient,
                mailData.subject || 'Sheetbase Email',
                mailData.body || 'Sheetbase email content.',
                mailData.options || {}
            );
        } catch(error) {
            return AppError.server(
                'mail/unknown',
                'Email not sent!'
            );
        }

        return mailData;
    }

    _Mail.quota = function () {
        return {
            remainingDailyQuota: MailApp.getRemainingDailyQuota()
        }
    }

    return _Mail;

})(Mail||{});