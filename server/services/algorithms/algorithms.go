package algorithms

import (
	"fmt"
	"strings"
	"time"

	"github.com/venicegeo/bf-ui/server/common/logger"
	"github.com/venicegeo/bf-ui/server/domain"
	"github.com/venicegeo/bf-ui/server/services/piazza"
)

const (
	defaultCacheTTL = 1 * time.Minute
	OutOfService    = "OUT OF SERVICE"

	// Image Requirements
	RequirementPrefix    = "imgReq - "
	Bands                = "Bands"
	CloudCover           = "CloudCover"
	NormalizedCloudCover = "Cloud Cover"
)

type (
	client interface {
		piazza.ServiceRetriever
	}
)

var (
	cache    map[string]*beachfront.Algorithm
	cacheTTL time.Duration
	quit     chan struct{}
)

func Initialize(client client, disableWorkers bool) {
	initializeCache(defaultCacheTTL)
	initializeQuitChannel()

	logger := logger.New()
	if disableWorkers {
		logger.Info("Background tasks disabled by config")
	} else {
		logger.Info("Starting background tasks")
		go cacheWorker(client, quit)
	}
}

func List() []beachfront.Algorithm {
	algorithms := make([]beachfront.Algorithm, 0)
	for _, algorithm := range cache {
		algorithms = append(algorithms, *algorithm)
	}
	return algorithms
}

func Reset() {
	cache = nil
	cacheTTL = 0
	if quit != nil {
		close(quit)
		quit = nil
	}
}

//
// Internals
//

func cacheWorker(client client, quit chan struct{}) {
	logger := logger.New()
	for {
		logger.Info("Refreshing algorithm cache")
		if algorithms, err := fetch(client); err == nil {
			current := make(map[string]*beachfront.Algorithm, 0)
			for _, algorithm := range algorithms {
				current[algorithm.ID] = &algorithm
			}
			cache = current
		}
		select {
		case <-quit:
			logger.Debug("Received quit signal")
			return
		default:
			logger.Info("Next refresh in %d minute(s)", cacheTTL/time.Minute)
			time.Sleep(cacheTTL)
		}
	}
}

func convert(services []piazza.Service) []beachfront.Algorithm {
	logger := logger.New()
	logger.Debug("Received %d services: %s", len(services), services)
	algorithms := make([]beachfront.Algorithm, 0)
	for _, service := range services {
		if service.ID != "" && service.ResourceMetadata.Availability != OutOfService {
			algorithm := beachfront.Algorithm{
				ID:           service.ID,
				Name:         service.ResourceMetadata.Name,
				Description:  service.ResourceMetadata.Description,
				Requirements: extractRequirements(service.ResourceMetadata.Extended),

				// HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK
				// HACK -- overriding because it doesn't look like the current algos actually _list_ inputs
				Inputs: []beachfront.AlgorithmInput{{"--image", "Images", beachfront.InputTypeImage}},
				// HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK
				// HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK HACK
			}
			algorithms = append(algorithms, algorithm)
		}
	}
	return algorithms
}

func extractRequirements(metadata map[string]string) []beachfront.AlgorithmRequirement {
	requirements := make([]beachfront.AlgorithmRequirement, 0)
	for key, value := range metadata {
		if strings.HasPrefix(key, RequirementPrefix) {
			name, description := normalizeRequirement(key, value)
			requirement := beachfront.AlgorithmRequirement{name, description}
			requirements = append(requirements, requirement)
		}
	}
	return requirements
}

func fetch(client client) ([]beachfront.Algorithm, error) {
	logger := logger.New()

	services, err := client.GetServices(piazza.SearchParameters{Pattern: "^BF_Algo_"})
	if err != nil {
		err := ErrRetrieval{err.Error()}
		logger.Error("%s", err)
		return nil, err
	}

	return convert(services), nil
}

func initializeCache(ttl time.Duration) {
	cacheTTL = ttl
	cache = make(map[string]*beachfront.Algorithm)
}

func initializeQuitChannel() {
	quit = make(chan struct{})
}

func normalizeRequirement(key, value string) (name, description string) {
	name = strings.Replace(key, RequirementPrefix, "", 1)
	value = strings.TrimSpace(value)
	switch name {
	case Bands:
		description = strings.Join(strings.Split(value, ","), " and ")
	case CloudCover:
		name = NormalizedCloudCover
		description = fmt.Sprintf("Less than %s", value)
	default:
		description = value
	}
	return
}

//
// Errors
//

type (
	ErrRetrieval struct {
		Message string
	}
)

func (e ErrRetrieval) Error() string {
	return fmt.Sprintf("ErrRetrieval: %s", e.Message)
}
