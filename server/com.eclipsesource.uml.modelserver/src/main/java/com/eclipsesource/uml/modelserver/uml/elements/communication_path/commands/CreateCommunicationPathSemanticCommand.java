package com.eclipsesource.uml.modelserver.uml.elements.communication_path.commands;

import org.eclipse.uml2.uml.AggregationKind;
import org.eclipse.uml2.uml.CommunicationPath;
import org.eclipse.uml2.uml.Node;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public class CreateCommunicationPathSemanticCommand
   extends BaseCreateSemanticRelationCommand<CommunicationPath, Node, Node> {

   protected final CreateCommunicationPathArgument argument;

   public CreateCommunicationPathSemanticCommand(final ModelContext context,
      final Node source, final Node target, final CreateCommunicationPathArgument argument) {
      super(context, source, target);
      this.argument = argument;
   }

   @Override
   protected CommunicationPath createSemanticElement(final Node source, final Node target) {
      var communicationPath = source.createCommunicationPath(true,
         argument.type.toAggregationKind(),
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
