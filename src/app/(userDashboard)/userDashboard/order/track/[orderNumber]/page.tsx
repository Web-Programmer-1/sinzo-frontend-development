import TrackOrder from "../../../../../../components/_USERDASHBOARD/_Orders/TrackOrder";

export default async function TrackOrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  return <TrackOrder orderNumber={orderNumber}></TrackOrder>
}