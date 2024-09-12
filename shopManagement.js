import { getSheetValues, appendSheetValues, updateSheetValues, deleteSheetRow } from './googleSheets';

export async function getShops() {
  try {
    console.log('Fetching shops...');
    const values = await getSheetValues('shops', 'A2:H');
    const shops = values.map(row => ({
      shopId: row[0] || '',
      name: row[1] || '',
      address: row[2] || '',
      phoneNumber: row[3] || '',
      email: row[4] || '',
      openingHours: row[5] || '',
      closedHours: row[6] || '',
      description: row[7] || ''
    })).filter(shop => shop.id && shop.name);
    console.log('Fetched shops:', shops);
    return shops;
  } catch (error) {
    console.error('Error fetching shops:', error);
    throw error;
  }
}

export async function createShop(shopData) {
  try {
    console.log('Creating new shop with data:', shopData);
    const shopId = await generateNewShopId();
    console.log('Generated new shop ID:', shopId);
    const values = [
      shopId,
      shopData.name,
      shopData.address || '',
      shopData.phoneNumber || '',
      shopData.email || '',
      shopData.openingHours || '',
      shopData.closedHours || '',
      shopData.description || ''
    ];
    console.log('Appending values to sheet:', values);
    await appendSheetValues('shops', values);
    const newShop = { id: shopId, ...shopData };
    console.log('New shop created:', newShop);
    return newShop;
  } catch (error) {
    console.error('Error creating shop:', error);
    throw error;
  }
}

export async function updateShop(shopId, shopData) {
  try {
    console.log(`Updating shop with ID: ${shopId}, Data:`, shopData);
    const shops = await getShops();
    const index = shops.findIndex(shop => shop.shopId === shopId);
    if (index === -1) throw new Error('Shop not found');

    const values = [
      shopId,
      shopData.name,
      shopData.address || '',
      shopData.phoneNumber || '',
      shopData.email || '',
      shopData.openingHours || '',
      shopData.closedHours || '',
      shopData.description || ''
    ];
    console.log('Updating sheet values:', values);
    await updateSheetValues('shops', `A${index + 2}:H${index + 2}`, [values]);
    const updatedShop = { id: shopId, ...shopData };
    console.log('Shop updated:', updatedShop);
    return updatedShop;
  } catch (error) {
    console.error('Error updating shop:', error);
    throw error;
  }
}

export async function deleteShop(shopId) {
  try {
    console.log(`Deleting shop with ID: ${shopId}`);
    const shops = await getShops();
    const index = shops.findIndex(shop => shop.shopId === shopId);
    if (index === -1) throw new Error('Shop not found');

    await deleteSheetRow('shops', index + 2);
    console.log(`Shop with ID ${shopId} deleted successfully`);
  } catch (error) {
    console.error('Error deleting shop:', error);
    throw error;
  }
}

async function generateNewShopId() {
  try {
    const shops = await getShops();
    const lastId = Math.max(...shops.map(shop => parseInt(shop.shopId) || 0), 0);
    const newId = (lastId + 1).toString();
    console.log('Generated new shop ID:', newId);
    return newId;
  } catch (error) {
    console.error('Error generating new shop ID:', error);
    throw error;
  }
}