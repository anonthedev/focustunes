import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sound } from "./types";
import { SOUND_LIBRARY } from "./types";

interface SoundLibraryProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddSound: (sound: Sound) => void;
  loadingSounds: Set<string>;
  activeSoundIds: Set<string>;
}

export function SoundLibrary({
  searchTerm,
  onSearchChange,
  onAddSound,
  loadingSounds,
  activeSoundIds,
}: SoundLibraryProps) {
  const filteredSounds = SOUND_LIBRARY.filter((sound) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      sound.name.toLowerCase().includes(searchLower) ||
      sound.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <CardTitle>Sound Library</CardTitle>
        <Input
          placeholder="Search sounds or tags..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSounds.map((sound) => (
            <Card
              key={sound.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardContent className="flex flex-col gap-2 py-4">
                  <h3 className="font-medium">{sound.name}</h3>
                  <div className="flex flex-wrap gap-1">
                    {sound.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => onAddSound(sound)}
                  disabled={
                    activeSoundIds.has(sound.id) || loadingSounds.has(sound.id)
                  }
                  className="w-full"
                  size="sm"
                >
                  {activeSoundIds.has(sound.id)
                    ? "Added"
                    : loadingSounds.has(sound.id)
                    ? "Loading..."
                    : "Add to Mix"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
