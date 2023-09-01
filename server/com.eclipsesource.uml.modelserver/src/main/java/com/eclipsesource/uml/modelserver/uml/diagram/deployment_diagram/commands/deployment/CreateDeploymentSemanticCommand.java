package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.deployment;

import java.util.LinkedList;

import org.eclipse.uml2.uml.Deployment;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public final class CreateDeploymentSemanticCommand
   extends BaseCreateSemanticRelationCommand<Deployment, NamedElement, NamedElement> {

   public CreateDeploymentSemanticCommand(final ModelContext context,
      final NamedElement source, final NamedElement target) {
      super(context, source, target);
   }

   @Override
   protected Deployment createSemanticElement(final NamedElement source, final NamedElement target) {
      var deployment = UMLFactory.eINSTANCE.createDeployment();

      deployment.getClients().add(source);
      deployment.getSuppliers().add(target);

      context.model.getPackagedElements().add(deployment);

      var list = new LinkedList<>(deployment.getClients());
      list.addAll(deployment.getSuppliers());
      var nameGenerator = new ListNameGenerator(Deployment.class, list);
      deployment.setName(nameGenerator.newName());

      return deployment;
   }

}
