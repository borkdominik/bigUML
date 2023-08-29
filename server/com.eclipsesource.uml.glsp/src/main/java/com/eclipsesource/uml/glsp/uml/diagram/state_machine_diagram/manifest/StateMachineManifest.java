package com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.manifest;

import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramCreateHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramDeleteHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramLabelEditMapperContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramUpdateHandlerContribution;
import com.eclipsesource.uml.glsp.features.property_palette.manifest.contributions.DiagramElementPropertyMapperContribution;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_Choice;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_DeepHistory;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_FinalState;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_Fork;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_InitialState;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_Join;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_Region;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_ShallowHistory;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_State;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_StateMachine;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.diagram.UmlStateMachine_Transition;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.features.label_edit.RegionLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.features.label_edit.StateLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.features.label_edit.StateMachineLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.features.label_edit.TransitionLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.features.property_palette.RegionPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.features.property_palette.StateMachinePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.features.property_palette.StatePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.features.property_palette.TransitionPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.features.tool_palette.StateMachineToolPaletteConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.gmodel.FinalStateNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.gmodel.PseudoStateNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.gmodel.RegionNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.gmodel.StateMachineNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.gmodel.StateNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.gmodel.TransitionEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.choice.CreateChoiceHandler;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.deep_history.CreateDeepHistoryHandler;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.final_state.CreateFinalStateHandler;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.final_state.DeleteFinalStateHandler;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.fork.CreateForkHandler;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.initial_state.CreateInitialStateHandler;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.join.CreateJoinHandler;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.pseudo_state.DeletePseudoStateHandler;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.region.CreateRegionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.region.DeleteRegionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.region.UpdateRegionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.shallow_history.CreateShallowHistoryHandler;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.state.CreateStateHandler;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.state.DeleteStateHandler;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.state.UpdateStateHandler;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.state_machine.CreateStateMachineHandler;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.state_machine.DeleteStateMachineHandler;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.state_machine.UpdateStateMachineHandler;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.transition.CreateTransitionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.transition.DeleteTransitionHandler;
import com.eclipsesource.uml.glsp.uml.diagram.state_machine_diagram.handler.operation.transition.UpdateTransitionHandler;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class StateMachineManifest extends DiagramManifest
   implements DiagramCreateHandlerContribution, DiagramDeleteHandlerContribution,
   DiagramUpdateHandlerContribution, DiagramElementPropertyMapperContribution,
   DiagramLabelEditMapperContribution {
   @Override
   public String id() {
      return representation().getName();
   }

   @Override
   public Representation representation() {
      return Representation.STATE_MACHINE;
   }

   @Override
   protected void configure() {
      super.configure();

      contributeDiagramElementConfiguration((nodes) -> {
         nodes.addBinding().to(UmlStateMachine_StateMachine.DiagramConfiguration.class);
         nodes.addBinding().to(UmlStateMachine_Region.DiagramConfiguration.class);
         nodes.addBinding().to(UmlStateMachine_InitialState.DiagramConfiguration.class);
         nodes.addBinding().to(UmlStateMachine_State.DiagramConfiguration.class);
         nodes.addBinding().to(UmlStateMachine_FinalState.DiagramConfiguration.class);
         nodes.addBinding().to(UmlStateMachine_Choice.DiagramConfiguration.class);
         nodes.addBinding().to(UmlStateMachine_Join.DiagramConfiguration.class);
         nodes.addBinding().to(UmlStateMachine_Fork.DiagramConfiguration.class);
         nodes.addBinding().to(UmlStateMachine_DeepHistory.DiagramConfiguration.class);
         nodes.addBinding().to(UmlStateMachine_ShallowHistory.DiagramConfiguration.class);
      }, (edges) -> {
         edges.addBinding().to(UmlStateMachine_Transition.DiagramConfiguration.class);
      });

      contributeToolPaletteConfiguration((contribution) -> {
         contribution.addBinding().to(StateMachineToolPaletteConfiguration.class);
      });

      contributeGModelMappers((contributions) -> {
         contributions.addBinding().to(StateMachineNodeMapper.class);
         contributions.addBinding().to(RegionNodeMapper.class);
         contributions.addBinding().to(PseudoStateNodeMapper.class);
         contributions.addBinding().to(StateNodeMapper.class);
         contributions.addBinding().to(TransitionEdgeMapper.class);
         contributions.addBinding().to(FinalStateNodeMapper.class);

      });

      contributeDiagramCreateNodeHandlers((contribution) -> {
         contribution.addBinding().to(CreateStateMachineHandler.class);
         contribution.addBinding().to(CreateRegionHandler.class);
         contribution.addBinding().to(CreateInitialStateHandler.class);
         contribution.addBinding().to(CreateStateHandler.class);
         contribution.addBinding().to(CreateFinalStateHandler.class);
         contribution.addBinding().to(CreateChoiceHandler.class);
         contribution.addBinding().to(CreateJoinHandler.class);
         contribution.addBinding().to(CreateForkHandler.class);
         contribution.addBinding().to(CreateDeepHistoryHandler.class);
         contribution.addBinding().to(CreateShallowHistoryHandler.class);
      });

      contributeDiagramCreateEdgeHandlers((contribution) -> {
         contribution.addBinding().to(CreateTransitionHandler.class);
      });

      contributeDiagramUpdateHandlers((contribution) -> {
         contribution.addBinding().to(UpdateStateMachineHandler.class);
         contribution.addBinding().to(UpdateStateHandler.class);
         contribution.addBinding().to(UpdateTransitionHandler.class);
         contribution.addBinding().to(UpdateRegionHandler.class);
      });

      contributeDiagramDeleteHandlers((contribution) -> {
         contribution.addBinding().to(DeleteStateMachineHandler.class);
         contribution.addBinding().to(DeleteTransitionHandler.class);
         contribution.addBinding().to(DeleteStateHandler.class);
         contribution.addBinding().to(DeleteRegionHandler.class);
         contribution.addBinding().to(DeleteFinalStateHandler.class);
         contribution.addBinding().to(DeletePseudoStateHandler.class);
      });

      contributeDiagramLabelEditMappers((contribution) -> {
         contribution.addBinding().to(StateMachineLabelEditMapper.class);
         contribution.addBinding().to(StateLabelEditMapper.class);
         contribution.addBinding().to(TransitionLabelEditMapper.class);
         contribution.addBinding().to(RegionLabelEditMapper.class);

      });
      contributeDiagramElementPropertyMappers((contribution) -> {
         contribution.addBinding().to(StateMachinePropertyMapper.class);
         contribution.addBinding().to(StatePropertyMapper.class);
         contribution.addBinding().to(TransitionPropertyMapper.class);
         contribution.addBinding().to(RegionPropertyMapper.class);
      });

   }
}
