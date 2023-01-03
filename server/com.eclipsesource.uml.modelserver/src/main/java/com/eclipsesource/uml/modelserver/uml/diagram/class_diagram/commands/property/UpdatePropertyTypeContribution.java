package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.modelserver.core.commands.noop.NoopCommand;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionEncoder;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.util.PropertyUtil;

public final class UpdatePropertyTypeContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "class:update_property_type";
   private static final String NEW_TYPE = "new_type";

   public static CCommand create(final Property semanticElement, final String newType) {
      return new ContributionEncoder().type(TYPE).element(semanticElement).extra(NEW_TYPE, newType).ccommand();
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var decoder = new ContributionDecoder(modelUri, domain, command);

      var context = decoder.context();
      var element = decoder.element(Property.class);
      var newType = PropertyUtil.getType(domain, decoder.extra(NEW_TYPE));

      return element
         .<Command> map(e -> new UpdatePropertyTypeSemanticCommand(context, e, newType))
         .orElse(new NoopCommand());
   }

}
