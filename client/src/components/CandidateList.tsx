import React from "react";
import { Candidate } from "./Candidates";
interface Props {
  candidates: Candidate[];
  handleCandidateCheck: (index: number) => void;
  checkedCandidateIndex: number | null;
}

const CandidateList = ({
  candidates,
  handleCandidateCheck,
  checkedCandidateIndex,
}: Props) => {
  return (
    <div>
      <table className="mt-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Candidate Name</th>
            <th className="px-4 py-2">Vote Count</th>
            <th className="px-4 py-2">Checked</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, index) => (
            <tr
              key={index}
              className={index === checkedCandidateIndex ? "bg-blue-300" : ""}
            >
              <td className="border px-4 py-2">{candidate.name}</td>
              <td className="border px-4 py-2">{candidate.voteCount}</td>
              <td className="border px-4 py-2">
                <input
                  type="checkbox"
                  checked={index === checkedCandidateIndex}
                  onChange={() => handleCandidateCheck(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateList;
