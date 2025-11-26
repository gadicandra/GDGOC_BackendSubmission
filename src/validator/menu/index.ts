import InvariantError from "../../exceptions/InvariantError";
import { MenuPayloadSchema } from "./schema";

const MenuValidator = {
    validateMenuPayload: (payload: any) => {
        const validationResult = MenuPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};
