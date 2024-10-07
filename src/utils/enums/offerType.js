class Offer {
    static OFFER_TYPES = {
        NO_OFFER: 0,
        DISCOUNT: 1,
        BUY_ONE_GET_ONE: 2
    };

    static castOfferType(offerType) {
        switch (offerType) {
            case Offer.OFFER_TYPES.DISCOUNT:
                return 'DISCOUNT';
            case Offer.OFFER_TYPES.BUY_ONE_GET_ONE:
                return 'BUY ONE GET ONE';
            case Offer.OFFER_TYPES.NO_OFFER:
            default:
                return 'NO OFFER AVAILABLE';
        }
    }
}

module.exports = Offer;
