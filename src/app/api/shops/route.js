import { getShops, createShop, updateShop, deleteShop } from '@/utils/shopManagement';
import { NextResponse } from 'next/server';
import { createSettingsForNewShops } from '@/utils/settingsManagement';

export async function GET(request) {
  try {
    console.log('GET request received for shops');
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shopId');
    const companyCode = searchParams.get('companyCode');
    
    if (shopId) {
      console.log(`Fetching shop with ID: ${shopId}`);
      const shop = await getShops(companyCode).then(shops => shops.find(s => s.shopId === shopId));
      if (!shop) {
        return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
      }
      return NextResponse.json(shop);
    } else {
      console.log('Fetching all shops');
      const shops = await getShops(companyCode);
      return NextResponse.json(shops);
    }
  } catch (error) {
    console.error('Error in GET /api/shops:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    console.log('POST request received for shops');
    const data = await request.json();
    const companyCode = data.companyCode;
    // console.log('Received shop data:', data);
    if (data.shopId) {
      return NextResponse.json({ error: 'ShopId should not be provided for new shops' }, { status: 400 });
    }
    const newShop = await createShop(data, companyCode);
    console.log('Created new shop:', newShop);

    // 新しいショップの設定を作成
    await createSettingsForNewShops(newShop.shopId, companyCode);

    return NextResponse.json(newShop, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/shops:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    console.log('PUT request received for shops');
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shopId');
    const companyCode = searchParams.get('companyCode');
    if (!shopId) {
      return NextResponse.json({ error: 'Shop ID is required' }, { status: 400 });
    }
    
    const data = await request.json();
    // console.log(`Updating shop with ID: ${shopId}, Data:`, data);
    const updatedShop = await updateShop(shopId, data, companyCode);
    console.log('Updated shop:', updatedShop);
    return NextResponse.json(updatedShop);
  } catch (error) {
    console.error('Error in PUT /api/shops:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    console.log('DELETE request received for shops');
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shopId');
    const companyCode = searchParams.get('companyCode');
    if (!shopId) {
      return NextResponse.json({ error: 'Shop ID is required' }, { status: 400 });
    }
    
    console.log(`Deleting shop with ID: ${shopId}`);
    await deleteShop(shopId, companyCode);
    console.log(`Shop with ID ${shopId} deleted successfully`);
    return NextResponse.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/shops:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}