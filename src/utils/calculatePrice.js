export const calculatePrice = (distance, duration) => {

    const basePrice = 750; // in naira

    const computedPrice = basePrice + (1.25 * distance) + (0.75 * duration);

    return computedPrice;
}