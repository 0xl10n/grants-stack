import ApplicationsApproved from "../ApplicationsApproved"
import {
  useBulkUpdateGrantApplicationsMutation,
  useListGrantApplicationsQuery,
} from "../../api/services/grantApplication"
import { makeGrantApplicationData, renderWrapped } from "../../../test-utils"
import { fireEvent, screen } from "@testing-library/react"

jest.mock("../../api/services/grantApplication");
jest.mock("../../common/Auth", () => ({
  useWallet: () => ({ provider: {} })
}))

const grantApplications = [
  makeGrantApplicationData({ status: "APPROVED" }),
  makeGrantApplicationData({ status: "APPROVED" }),
  makeGrantApplicationData({ status: "APPROVED" })
];

let bulkUpdateGrantApplications = jest.fn()

describe("<ApplicationsApproved />", () => {
  beforeEach(() => {
    (useListGrantApplicationsQuery as any).mockReturnValue({
      data: grantApplications, refetch: jest.fn(), isSuccess: true, isLoading: false
    });

    bulkUpdateGrantApplications = jest.fn().mockImplementation(
      () => {
        return {
          unwrap: async () => Promise.resolve({
            data: "hi ",
          }),
        }
      },
    );
    (useBulkUpdateGrantApplicationsMutation as jest.Mock).mockReturnValue([
      bulkUpdateGrantApplications,
      {
        isLoading: false
      }
    ]);
  })

  describe("when bulkSelect is true", () => {
    it("renders reject buttons on each project card", () => {
      renderWrapped(<ApplicationsApproved bulkSelect={true} />);
      expect(screen.queryAllByTestId("reject-button"))
        .toHaveLength(grantApplications.length);
    });

    it("does not display approve buttons in approved applications tab", () => {
      renderWrapped(<ApplicationsApproved bulkSelect={true} />)

      const approveButtons = screen.queryAllByTestId("approve-button")
      expect(approveButtons.length).toEqual(0)
    });

    it("selects a reject button when reject button is clicked", () => {
      renderWrapped(<ApplicationsApproved bulkSelect={true} />)

      const rejectButton = screen.queryAllByTestId("reject-button")[0]
      fireEvent.click(rejectButton)

      expect(rejectButton).toHaveClass("bg-white text-pink-500")
    });

    it("unselects a reject button when a selected reject button is clicked", () => {
      renderWrapped(<ApplicationsApproved bulkSelect={true} />)

      const rejectButton = screen.queryAllByTestId("reject-button")[0]
      fireEvent.click(rejectButton)
      fireEvent.click(rejectButton)

      expect(rejectButton).not.toHaveClass("bg-white text-pink-500")
    });
  });

  describe("when bulkSelect is false", () => {
    it("does not render approve and reject buttons on each card", () => {
      renderWrapped(<ApplicationsApproved bulkSelect={false} />)
      expect(screen.queryAllByTestId("bulk-approve-reject-buttons")).toHaveLength(0)
    })
  });
})