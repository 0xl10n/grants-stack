import { useNavigate, useParams } from "react-router-dom"

import { Button } from "../common/styles"
import { useWeb3 } from "../common/ProtectedRoute"
import { useListRoundsQuery } from "../api/services/round"


export default function ViewRound() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { account } = useWeb3()
  const { round } = useListRoundsQuery({ account }, {
    selectFromResult: ({ data }) => ({ round: data?.find((round) => round.id === id) }),
  })

  const goBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    navigate("/")
  }

  const goToApplications = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    navigate(`/round/${id}/applications`)
  }

  return (
    <div className="container mx-auto px-4 py-16 h-screen">
      <header>
        <p className="mb-16">
          <span className="text-5xl">{round?.metadata?.name || "..."}</span>
          <span className="float-right truncate">📒: {account}</span>
        </p>
      </header>
      <main>
        <div>
          {/* <div>
            <h2 className="text-3xl mb-8">Operator Wallets</h2>
            {round?.operatorWallets.map((operatorWallet, index) =>
              <p key={index} className="truncate">{operatorWallet}</p>
            ) || <p>Fetching operator wallets...</p>}
          </div><br /> */}
          <p className="my-4">
            <span className="text-2xl">Application Start Date: </span>
            <span>{round?.applicationStartTime.toString()}</span>
          </p>
          <p className="my-4">
            <span className="text-2xl">Round Start Date: </span>
            <span>{round?.startTime.toString()}</span>
          </p>
          <p className="my-4">
            <span className="text-2xl">Round End Date: </span>
            <span>{round?.endTime.toString()}</span>
          </p>
          <p className="my-4">
            <span className="text-2xl">Supported Token for Voting: </span>
            <a
              href={`https://goerli.etherscan.io/address/${round?.token}`}
              rel="noopener noreferrer"
              target="_blank"
              className="text-blue-600 underline">
              {round?.token}
            </a>
          </p>
          <p className="my-4">
          <span className="text-2xl">Voting Contract Address: </span>
            <a
              href={`https://goerli.etherscan.io/address/${round?.votingContract}`}
              rel="noopener noreferrer"
              target="_blank"
              className="text-blue-600 underline">
              {round?.votingContract}
            </a>
          </p>
          <Button type="button" onClick={goToApplications}>Review Applications</Button><br />
          <Button type="button" onClick={goBack}>Back</Button>
        </div>
      </main>
    </div >
  )
}