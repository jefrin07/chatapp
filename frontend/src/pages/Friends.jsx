import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import { Link } from "react-router";

const Friends = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["allfriends"],
    queryFn: getUserFriends,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          All Friends
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : data.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {data.map((friend) => (
              <div
                key={friend._id}
                className="card bg-base-100 shadow hover:shadow-md transition-shadow"
              >
                <div className="card-body flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="avatar w-16 h-16 rounded-full bg-base-200">
                      <img
                        src={friend.profilePic}
                        alt={friend.fullname}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{friend.fullname}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="badge badge-secondary badge-sm">
                          Native: {friend.nativeLanguage}
                        </span>
                        <span className="badge badge-outline badge-sm">
                          Learning: {friend.learningLanguage}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
                    Message
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No friends found.</div>
        )}
      </div>
    </div>
  );
};

export default Friends;
