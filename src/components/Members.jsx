import PropTypes from "prop-types"; // Import PropTypes for validation

const getStatusStyle = (status) => {
    switch (status) {
        case "완료":
            return { backgroundColor: "rgba(0, 255, 0, 1)" }; // 초록색
        case "진행중":
            return { backgroundColor: "rgba(255, 165, 0, 0.7)" }; // 주황색
        case "미실시":
            return { backgroundColor: "rgba(128, 128, 128, 0.3)" }; // 회색
        default:
            return { backgroundColor: "rgba(128, 128, 128, 0.3)" }; // 기본값 (회색)
    }
};

const Members = ({ members, toggleStatus }) => (
    <div className="member-status">
        <ul className="member-list">
            {members.map((member, index) => (
                <p key={index} className="circle" style={getStatusStyle(member.status)} onClick={() => toggleStatus(index)}>
                    {member.name.charAt(0)}
                    <span className="tooltip">{member.name}</span>
                </p>
            ))}
        </ul>
    </div>
);

// Add PropTypes for Members component
Members.propTypes = {
    members: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            status: PropTypes.oneOf(["완료", "진행중", "미실시"]).isRequired,
        })
    ).isRequired, // Validating that members is an array of objects with 'name' and 'status'
    toggleStatus: PropTypes.func.isRequired, // Function to toggle status
};

export default Members;
