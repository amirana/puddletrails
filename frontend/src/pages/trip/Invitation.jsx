import { useParams, useNavigate } from "react-router-dom";
import {
    acceptInvitation as acceptInvitationService,
    declineInvitation as declineInvitationService,
} from "../../services/TripService.js";
import { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";

const Invitation = () => {
    const { token } = useParams();
    const { accessToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleAccept = async () => {
        try {
            const result = await acceptInvitationService(token, accessToken);

            const tripId = result.data.member.trip;

            navigate(`/trips/${tripId}`);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        if (!accessToken) {
            navigate(`/login?redirect=/invitations/${token}`);
        }
    }, [accessToken, token, navigate]);

    return (
        <main>
            <h1>You've been invited to join a trip</h1>
            <h2>{token}</h2>

            <div>
                <button type="button" onClick={handleAccept}>
                    Accept
                </button>
                <button
                    type="button"
                    onClick={() => declineInvitationService(token, accessToken)}
                >
                    Decline
                </button>
            </div>
            {error && <p>{error}</p>}
        </main>
    );
};

export default Invitation;
