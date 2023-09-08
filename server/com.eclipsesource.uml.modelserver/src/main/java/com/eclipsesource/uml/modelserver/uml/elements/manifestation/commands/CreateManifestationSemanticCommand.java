package com.eclipsesource.uml.modelserver.uml.elements.manifestation.commands;

import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.Manifestation;
import org.eclipse.uml2.uml.PackageableElement;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseCreateSemanticRelationCommand;
import com.eclipsesource.uml.modelserver.uml.generator.ListNameGenerator;

public final class CreateManifestationSemanticCommand
   extends BaseCreateSemanticRelationCommand<Manifestation, PackageableElement, PackageableElement> {

   public CreateManifestationSemanticCommand(final ModelContext context,
      final PackageableElement source, final PackageableElement target) {
      super(context, source, target);
   }

   @Override
   protected Manifestation createSemanticElement(final PackageableElement source, final PackageableElement target) {
      var parent = source.getNearestPackage();
      var nameGenerator = new ListNameGenerator(Manifestation.class, parent.allNamespaces());

      if (source instanceof Artifact) {
         var artifact = (Artifact) source;
         return artifact.createManifestation(nameGenerator.newName(), target);
      }

      var manifestation = UMLFactory.eINSTANCE.createManifestation();
      manifestation.getClients().add(source);
      manifestation.getSuppliers().add(target);

      manifestation.setName(nameGenerator.newName());
      parent.getPackagedElements().add(manifestation);
      return manifestation;
   }

}
