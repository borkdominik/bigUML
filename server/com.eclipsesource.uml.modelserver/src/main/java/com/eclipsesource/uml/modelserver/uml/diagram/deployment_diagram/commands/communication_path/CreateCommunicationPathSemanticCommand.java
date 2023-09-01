package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.communication_path;

import org.eclipse.uml2.uml.AggregationKind;
import org.eclipse.uml2.uml.CommunicationPath;
import org.eclipse.uml2.uml.Node;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.constants.AssociationType;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public final class CreateCommunicationPathSemanticCommand
   extends BaseCreateSemanticRelationCommand<CommunicationPath, Node, Node> {

   protected final AssociationType type;

   public CreateCommunicationPathSemanticCommand(final ModelContext context,
      final Node source, final Node target, final AssociationType type) {
      super(context, source, target);
      this.type = type;
   }

   @Override
   protected CommunicationPath createSemanticElement(final Node source, final Node target) {
      var communicationPath = source.createCommunicationPath(true,
         type.toAggregationKind(),
         target.getName(),
         1, 1,
         target,
         true,
         AggregationKind.NONE_LITERAL,
         source.getName(),
         1, 1);

      var nameGenerator = new ListNameGenerator(CommunicationPath.class, source.getCommunicationPaths());

      communicationPath.setName(nameGenerator.newName());
      return communicationPath;
   }

}
