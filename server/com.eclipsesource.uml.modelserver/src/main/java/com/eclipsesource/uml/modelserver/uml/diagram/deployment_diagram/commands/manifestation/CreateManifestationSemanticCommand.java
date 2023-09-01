package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.manifestation;

import java.util.LinkedList;

import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.Manifestation;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.PackageableElement;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public final class CreateManifestationSemanticCommand
   extends BaseCreateSemanticRelationCommand<Manifestation, NamedElement, NamedElement> {

   public CreateManifestationSemanticCommand(final ModelContext context,
      final NamedElement source, final NamedElement target) {
      super(context, source, target);
   }

   @Override
   protected Manifestation createSemanticElement(final NamedElement source, final NamedElement target) {
      var artifact = (Artifact) source;

      var manifestation = artifact.createManifestation(null, (PackageableElement) target);
      manifestation.getClients().add(source);
      manifestation.getSuppliers().add(target);

      var list = new LinkedList<>(manifestation.getClients());
      list.addAll(manifestation.getSuppliers());
      var nameGenerator = new ListNameGenerator(Manifestation.class, list);
      manifestation.setName(nameGenerator.newName());

      return manifestation;
   }

}
