export const convertUTCToLocal = (utc) => {
    const UTC = new Date(utc);
    const local = new Date();

    /**
     * set time utc for local => local automatically converted UTC to local
     */
    local.setUTCFullYear(UTC.getFullYear());
    local.setUTCMonth(UTC.getMonth());
    local.setUTCDate(UTC.getDate());
    local.setUTCHours(UTC.getHours());
    local.setUTCMinutes(UTC.getMinutes());
    local.setUTCSeconds(UTC.getSeconds());
    local.setUTCMilliseconds(UTC.getMilliseconds());

    return local;
};
