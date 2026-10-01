import * as waitlistService from "./waitlist.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const joinWaitList = async (req, res) => {
    const result = await waitlistService.join(req.body);
    ApiResponse.ok(
        res,
        result.alreadyJoined
            ? "You're already on the list!"
            : "You're on the list!",
        {
            alreadyJoined: result.alreadyJoined,
            confirmationEmailSent: result.confirmationEmailSent,
        },
    );
};

export { joinWaitList };
