import { useVideo } from "@100mslive/react-sdk";

interface PeerProps {
  peer: any;
}

const Peer = ({ peer }: PeerProps) => {
  const { videoRef } = useVideo({
    trackId: peer.videoTrack,
  });
  return (
    <div className="peer-container p-2">
      <video
        ref={videoRef}
        className={`peer-video h-[480px] w-[500px] object-cover block mb-2 ${peer.isLocal ? "-scale-x-95" : ""}`}
        autoPlay
        muted
        playsInline
      />
      <div className="peer-name text-sm text-center">
        {peer.name} {peer.isLocal ? "(You)" : ""}
      </div>
    </div>
  );
};

export default Peer;
